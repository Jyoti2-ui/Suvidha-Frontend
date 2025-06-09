document.addEventListener('DOMContentLoaded', function() {
   
    let currentSection = 'profile';
    let uploadedResumeFile = null;

    
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const welcomeUserName = document.getElementById('welcomeUserName');
    const profileForm = document.getElementById('profileForm');
    const photoInput = document.getElementById('photoInput');
    const profileImg = document.getElementById('profileImg');
    const resumeInput = document.getElementById('resumeInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const resumePreview = document.getElementById('resumePreview');
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    const updateResumeBtn = document.getElementById('updateResumeBtn');
    const deleteResumeBtn = document.getElementById('deleteResumeBtn');
    
   
    const openResumeBuilderBtn = document.getElementById('openResumeBuilderBtn');
    const resumeMainView = document.getElementById('resume-main-view');
    const resumeBuilderView = document.getElementById('resume-builder-view');
    const closeResumeBuilderBtn = document.getElementById('closeResumeBuilderBtn');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addExtraCurricularBtn = document.getElementById('addExtraCurricularBtn');
    const addTrainingBtn = document.getElementById('addTrainingBtn');
    const previewResumeBtn = document.getElementById('previewResumeBtn');
    const saveAndDownloadResumeBtn = document.getElementById('saveAndDownloadResumeBtn');
    const builderPreview = document.getElementById('builderPreview');


    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortBy = document.getElementById('sortBy');

   
    const modal = document.getElementById('applicationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmApplication');
    const cancelBtn = document.getElementById('cancelApplication');
    const closeModalBtn = document.querySelector('.close-modal');

    
    function initializeDashboard() {
        initializeNavigation();
        initializeProfile();
        initializeResumeHandling();
        initializeResumeBuilder();
        populateLocations();
        populateInternships();
        populateApplications();
        initializeInternshipFilters();
        initializeModal();
        showNotification('Welcome to your dashboard!', 'success');
    }

    
    function initializeNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', () => switchSection(item.dataset.section));
        });
    }

    function switchSection(sectionId) {
        currentSection = sectionId;
        navItems.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
        contentSections.forEach(section => section.classList.toggle('active', section.id === sectionId));
    }

    
    function initializeProfile() {
        profileForm.addEventListener('submit', e => {
            e.preventDefault();
            saveProfile();
        });
        photoInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const imageUrl = e.target.result;
                    profileImg.src = imageUrl;
                  
                    document.getElementById('headerUserAvatar').src = imageUrl;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    function saveProfile() {
        const newName = document.getElementById('fullName').value;
       
        document.getElementById('studentName').textContent = newName;
        document.getElementById('studentEmail').textContent = document.getElementById('email').value;
        document.getElementById('studentMajor').textContent = document.getElementById('major').value;
        
        
        welcomeUserName.textContent = `Welcome  ${newName}`;
        
        showNotification('Profile updated successfully!', 'success');
    }

    
    function initializeResumeHandling() {
        uploadArea.addEventListener('click', () => resumeInput.click());
        uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', e => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) handleResumeFile(file);
        });
        resumeInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) handleResumeFile(file);
        });

        updateResumeBtn.addEventListener('click', () => resumeInput.click());
        deleteResumeBtn.addEventListener('click', deleteResume);
        downloadResumeBtn.addEventListener('click', downloadResume);
    }

    function handleResumeFile(file) {
        if (!file.type.match(/pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml/)) {
            showNotification('Invalid file type. Please upload PDF or Word.', 'error');
            return;
        }
        uploadedResumeFile = file;
        showResumePreview(file);
        showNotification('Resume uploaded!', 'success');
    }
    
    function showResumePreview(file) {
        previewSection.style.display = 'block';
        uploadArea.parentElement.style.display = 'none';

        if (file.type === 'application/pdf') {
            const fileURL = URL.createObjectURL(file);
            resumePreview.innerHTML = `<embed src="${fileURL}" type="application/pdf">`;
        } else {
            resumePreview.innerHTML = `<div class="word-preview"><i class="fas fa-file-word"></i><p>${file.name}</p></div>`;
        }
    }

    function deleteResume() {
        if (confirm('Are you sure you want to delete your resume?')) {
            uploadedResumeFile = null;
            resumeInput.value = '';
            previewSection.style.display = 'none';
            uploadArea.parentElement.style.display = 'block';
            resumePreview.innerHTML = '';
            showNotification('Resume deleted.', 'info');
        }
    }

    function downloadResume() {
        if (uploadedResumeFile) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(uploadedResumeFile);
            link.download = uploadedResumeFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            showNotification('No resume file to download.', 'error');
        }
    }

   
    function initializeResumeBuilder() {
        openResumeBuilderBtn.addEventListener('click', () => {
            resumeMainView.style.display = 'none';
            resumeBuilderView.style.display = 'block';
        });
        closeResumeBuilderBtn.addEventListener('click', () => {
            resumeBuilderView.style.display = 'none';
            resumeMainView.style.display = 'block';
        });
        addEducationBtn.addEventListener('click', () => addEntry('education'));
        addExperienceBtn.addEventListener('click', () => addEntry('experience'));
        addProjectBtn.addEventListener('click', () => addEntry('project'));
        addExtraCurricularBtn.addEventListener('click', () => addEntry('extraCurricular'));
        addTrainingBtn.addEventListener('click', () => addEntry('training'));
        previewResumeBtn.addEventListener('click', generateResumePreview);
        saveAndDownloadResumeBtn.addEventListener('click', downloadBuilderResume);
    }
    
    function addEntry(type) {
        const container = document.getElementById(`${type}Entries`);
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        let fields = '';
        if (type === 'education') {
            fields = `
                <input type="text" class="rbDegree" placeholder="Degree (e.g., B.Tech)">
                <input type="text" class="rbSchool" placeholder="Institution Name">
                <input type="text" class="rbGradDate" placeholder="Graduation Date (e.g., May 2026)">
                <input type="text" class="rbGpa" placeholder="GPA (optional)">`;
        } else if (type === 'experience') {
            fields = `
                <input type="text" class="rbJobTitle" placeholder="Job Title">
                <input type="text" class="rbCompany" placeholder="Company Name">
                <input type="text" class="rbDates" placeholder="Dates (e.g., Jun 2023 - Present)">
                <textarea class="rbResponsibilities" placeholder="Key Responsibilities (use new lines for bullets)"></textarea>`;
        } else if (type === 'project') {
            fields = `
                <input type="text" class="rbProjectTitle" placeholder="Project Title">
                <textarea class="rbProjectDesc" placeholder="Project Description (use new lines for bullets)"></textarea>`;
        } else if (type === 'extraCurricular') {
            fields = `
                <input type="text" class="rbActivityTitle" placeholder="Activity Title / Your Role">
                <textarea class="rbActivityDesc" placeholder="Description (e.g., Organized a university-level coding competition...)"></textarea>`;
        } else if (type === 'training') {
            fields = `
                <input type="text" class="rbCourseName" placeholder="Training/Course Name">
                <input type="text" class="rbCourseOrg" placeholder="Issuing Organization (e.g., Coursera, Udemy)">
                <input type="text" class="rbCourseDate" placeholder="Completion Date (e.g., Aug 2023)">`;
        }
        entryDiv.innerHTML = fields;
        container.appendChild(entryDiv);
    }

    function getResumeData() {
        const data = {};
        data.name = document.getElementById('rbName').value;
        data.email = document.getElementById('rbEmail').value;
        data.phone = document.getElementById('rbPhone').value;
        data.address = document.getElementById('rbAddress').value;
        data.linkedin = document.getElementById('rbLinkedIn').value;
        data.github = document.getElementById('rbGithub').value;
        
        data.education = Array.from(document.querySelectorAll('#educationEntries .entry')).map(el => ({
            degree: el.querySelector('.rbDegree').value,
            school: el.querySelector('.rbSchool').value,
            date: el.querySelector('.rbGradDate').value,
            gpa: el.querySelector('.rbGpa').value,
        }));

        data.experience = Array.from(document.querySelectorAll('#experienceEntries .entry')).map(el => ({
            title: el.querySelector('.rbJobTitle').value,
            company: el.querySelector('.rbCompany').value,
            dates: el.querySelector('.rbDates').value,
            responsibilities: el.querySelector('.rbResponsibilities').value,
        }));

        data.projects = Array.from(document.querySelectorAll('#projectEntries .entry')).map(el => ({
            title: el.querySelector('.rbProjectTitle').value,
            description: el.querySelector('.rbProjectDesc').value,
        }));
        
        data.extraCurricular = Array.from(document.querySelectorAll('#extraCurricularEntries .entry')).map(el => ({
            title: el.querySelector('.rbActivityTitle').value,
            description: el.querySelector('.rbActivityDesc').value,
        }));

        data.trainings = Array.from(document.querySelectorAll('#trainingEntries .entry')).map(el => ({
            name: el.querySelector('.rbCourseName').value,
            organization: el.querySelector('.rbCourseOrg').value,
            date: el.querySelector('.rbCourseDate').value,
        }));
        
        data.skills = document.getElementById('rbSkills').value.split(',').map(s => s.trim()).filter(s => s);
        return data;
    }
    
    function generateResumePreview() {
        const data = getResumeData();

        const formatUrl = (url) => {
            if (!url) return '';
            if (!/^https?:\/\//i.test(url)) {
                return `https://${url}`;
            }
            return url;
        };

        const linkedInUrl = formatUrl(data.linkedin);
        const githubUrl = formatUrl(data.github);

        let contactInfoHTML = [data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : '', data.phone, data.address].filter(Boolean).join(' | ');
        let socialLinksHTML = [
            linkedInUrl ? `<a href="${linkedInUrl}" target="_blank">LinkedIn</a>` : '',
            githubUrl ? `<a href="${githubUrl}" target="_blank">GitHub</a>` : ''
        ].filter(Boolean).join(' | ');

        let educationHTML = '';
        if (data.education.length > 0 && data.education[0].degree) {
            educationHTML += '<div class="rt-section"><h3>Education</h3>';
            data.education.forEach(edu => {
                educationHTML += `
                    <div class="rt-entry">
                        <div class="rt-entry-header">
                            <h4>${edu.degree}</h4>
                            <em>${edu.date}</em>
                        </div>
                        <p><strong>${edu.school}</strong></p>
                        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                    </div>`;
            });
            educationHTML += '</div>';
        }

        const formatResponsibilities = (text) => `<ul>${text.split('\n').filter(line => line.trim() !== '').map(line => `<li>${line}</li>`).join('')}</ul>`;

        let experienceHTML = '';
        if (data.experience.length > 0 && data.experience[0].title) {
            experienceHTML += '<div class="rt-section"><h3>Experience</h3>';
            data.experience.forEach(exp => {
                experienceHTML += `
                    <div class="rt-entry">
                        <div class="rt-entry-header">
                            <h4>${exp.title}</h4>
                            <em>${exp.dates}</em>
                        </div>
                        <p><strong>${exp.company}</strong></p>
                        ${exp.responsibilities ? formatResponsibilities(exp.responsibilities) : ''}
                    </div>`;
            });
            experienceHTML += '</div>';
        }
        
        let projectsHTML = '';
        if (data.projects.length > 0 && data.projects[0].title) {
            projectsHTML += '<div class="rt-section"><h3>Projects</h3>';
            data.projects.forEach(proj => {
                projectsHTML += `
                    <div class="rt-entry">
                        <h4>${proj.title}</h4>
                        ${proj.description ? formatResponsibilities(proj.description) : ''}
                    </div>`;
            });
            projectsHTML += '</div>';
        }

        let extraCurricularHTML = '';
        if (data.extraCurricular.length > 0 && data.extraCurricular[0].title) {
            extraCurricularHTML += '<div class="rt-section"><h3>Extra Curricular Activities</h3>';
            data.extraCurricular.forEach(activity => {
                extraCurricularHTML += `
                    <div class="rt-entry">
                        <h4>${activity.title}</h4>
                        ${activity.description ? formatResponsibilities(activity.description) : ''}
                    </div>`;
            });
            extraCurricularHTML += '</div>';
        }

        let trainingsHTML = '';
        if (data.trainings.length > 0 && data.trainings[0].name) {
            trainingsHTML += '<div class="rt-section"><h3>Trainings & Courses</h3>';
            data.trainings.forEach(course => {
                trainingsHTML += `
                    <div class="rt-entry">
                        <div class="rt-entry-header">
                            <h4>${course.name}</h4>
                            <em>${course.date}</em>
                        </div>
                        <p><strong>${course.organization}</strong></p>
                    </div>`;
            });
            trainingsHTML += '</div>';
        }

        let skillsHTML = '';
        if (data.skills.length > 0) {
            skillsHTML += '<div class="rt-section"><h3>Skills</h3><ul class="rt-skills-list">';
            data.skills.forEach(skill => {
                skillsHTML += `<li class="rt-skill-item">${skill}</li>`;
            });
            skillsHTML += '</ul></div>';
        }

        builderPreview.innerHTML = `
            <div class="rt-header">
                <h1>${data.name || 'Your Name'}</h1>
                <div class="rt-contact-info">${contactInfoHTML}</div>
                <div class="rt-social-links">${socialLinksHTML}</div>
            </div>
            ${educationHTML}
            ${experienceHTML}
            ${projectsHTML}
            ${extraCurricularHTML}
            ${trainingsHTML}
            ${skillsHTML}
        `;
        showNotification('Preview updated!', 'info');
    }
    
    function downloadBuilderResume() {
        generateResumePreview(); 
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const resumeContent = document.getElementById('builderPreview');
        
        pdf.html(resumeContent, {
            callback: function (doc) {
                doc.save('resume.pdf');
                showNotification('Downloading your resume as PDF!', 'success');
            },
            x: 15,
            y: 15,
            width: 180, 
            windowWidth: resumeContent.scrollWidth
        });
    }


    
    const indianCities = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", 
        "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", 
        "Varanasi", "Srinagar", "Aurangabad", "Amritsar", "Navi Mumbai", "Ranchi", "Coimbatore", "Jabalpur", "Gwalior", 
        "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Remote"
    ];

    const sampleInternships = [
        { id: 1, title: 'Frontend Developer Intern', company: 'Tech Solutions', location: 'Bangalore', type: 'software', stipend: '25,000', period: '3 months', remote: false, postedDaysAgo: 2 },
        { id: 2, title: 'UX/UI Design Intern', company: 'Creative Minds', location: 'Pune', type: 'design', stipend: '20,000', period: '2 months', remote: false, postedDaysAgo: 5 },
        { id: 3, title: 'Digital Marketing Intern', company: 'MarketBoost', location: 'Remote', type: 'marketing', stipend: '15,000', period: '4 months', remote: true, postedDaysAgo: 1 },
        { id: 4, title: 'Data Science Intern', company: 'DataWiz', location: 'Hyderabad', type: 'data', stipend: '30,000', period: '6 months', remote: false, postedDaysAgo: 10 },
        { id: 5, title: 'HR Intern', company: 'PeopleConnect', location: 'Delhi', type: 'hr', stipend: '18,000', period: '3 months', remote: false, postedDaysAgo: 7 },
        { id: 6, title: 'Backend Developer Intern', company: 'InnovateIO', location: 'Mumbai', type: 'software', stipend: '28,000', period: '3 months', remote: false, postedDaysAgo: 3 }
    ];
    
    let userApplications = [
        { id: 1, company: 'Google Inc.', position: 'Software Engineering Intern', status: 'accepted', appliedDate: 'March 15, 2024', details: 'Offer accepted. Onboarding process will begin soon.' },
        { id: 2, company: 'Microsoft', position: 'Frontend Developer Intern', status: 'under-review', appliedDate: 'March 10, 2024', details: 'Application submitted. Awaiting review from the hiring team.' },
        { id: 3, company: 'Apple Inc.', position: 'iOS Developer Intern', status: 'rejected', appliedDate: 'March 5, 2024', details: 'After careful consideration, we have decided to move forward with other candidates.' },
    ];


    
    function populateLocations() {
        indianCities.sort().forEach(city => {
            const option = new Option(city, city.toLowerCase().replace(/\s+/g, '-'));
            locationFilter.add(option);
        });
    }

    function populateInternships() {
        const grid = document.getElementById('internshipsGrid');
        grid.innerHTML = '';
        sampleInternships.forEach(internship => {
            const card = document.createElement('div');
            card.className = 'internship-card';
            card.dataset.location = internship.remote ? 'remote' : internship.location.toLowerCase();
            card.dataset.type = internship.type;
            card.dataset.company = internship.company.toLowerCase();
            card.dataset.title = internship.title.toLowerCase();

            card.innerHTML = `
                <div class="card-header">
                    <div class="company-info">
                        <i class="fas fa-building"></i>
                        <div>
                            <h4>${internship.title}</h4>
                            <p>${internship.company}</p>
                        </div>
                    </div>
                    ${internship.remote ? '<span class="remote-badge">Remote</span>' : `<span class="location-badge">${internship.location}</span>`}
                </div>
                <div class="card-content">
                    <div class="internship-details">
                        <span><i class="fas fa-calendar-alt"></i> ${internship.period}</span>
                        <span><i class="fas fa-rupee-sign"></i> ${internship.stipend}/month</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm apply-btn" data-id="${internship.id}">Apply Now</button>
                    <span class="posted-ago">Posted ${internship.postedDaysAgo}d ago</span>
                </div>`;
            grid.appendChild(card);
        });
        document.querySelectorAll('.apply-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const internshipId = e.target.dataset.id;
            const internship = sampleInternships.find(i => i.id == internshipId);
            openApplicationModal(internship);
        }));
    }

    function initializeInternshipFilters() {
        [searchInput, locationFilter, typeFilter].forEach(el => el.addEventListener('input', filterAndSortInternships));
        sortBy.addEventListener('change', filterAndSortInternships);
    }
    
    function filterAndSortInternships() {
        const cards = Array.from(document.querySelectorAll('.internship-card'));
        const searchTerm = searchInput.value.toLowerCase();
        const locationValue = locationFilter.value;
        const typeValue = typeFilter.value;

        cards.forEach(card => {
            const matchesSearch = card.dataset.title.includes(searchTerm) || card.dataset.company.includes(searchTerm);
            const matchesLocation = !locationValue || card.dataset.location === locationValue || (locationValue === 'remote' && card.dataset.location === 'remote');
            const matchesType = !typeValue || card.dataset.type === typeValue;
            card.style.display = (matchesSearch && matchesLocation && matchesType) ? 'block' : 'none';
        });

        const visibleCards = cards.filter(card => card.style.display !== 'none');
        const sortValue = sortBy.value;
        visibleCards.sort((a, b) => {
            let valA, valB;
            if (sortValue === 'company') {
                valA = a.dataset.company;
                valB = b.dataset.company;
            } else if (sortValue === 'location') {
                valA = a.dataset.location;
                valB = b.dataset.location;
            } else { return 0; }
            return valA.localeCompare(valB);
        });

        const grid = document.getElementById('internshipsGrid');
        visibleCards.forEach(card => grid.appendChild(card));
    }


    function populateApplications() {
        const list = document.getElementById('applicationsList');
        list.innerHTML = '';
        userApplications.forEach(app => {
            const item = document.createElement('div');
            item.className = 'application-item';
            item.innerHTML = `
                <div class="company-logo"><i class="fas fa-building"></i></div>
                <div class="application-details">
                    <h4>${app.position}</h4>
                    <p>${app.company}</p>
                    <small>Applied on: ${app.appliedDate}</small>
                </div>
                <div class="application-status">
                    <span class="status ${app.status.replace(/\s+/g, '-')}">${app.status}</span>
                </div>
                <div class="application-actions">
                    <button class="btn btn-secondary btn-sm view-details-btn" data-id="${app.id}">View Details</button>
                </div>
                <div class="application-details-hidden" id="details-${app.id}">
                    <p><strong>Status Update:</strong> ${app.details}</p>
                </div>
            `;
            list.appendChild(item);
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const detailsId = `details-${e.target.dataset.id}`;
                const detailsEl = document.getElementById(detailsId);
                detailsEl.style.display = (detailsEl.style.display === 'block') ? 'none' : 'block';
            });
        });

        updateApplicationStats();
    }

    function updateApplicationStats() {
        document.getElementById('totalApps').textContent = userApplications.length;
        document.getElementById('reviewApps').textContent = userApplications.filter(a => a.status === 'under-review').length;
        document.getElementById('acceptedApps').textContent = userApplications.filter(a => a.status === 'accepted').length;
        document.getElementById('rejectedApps').textContent = userApplications.filter(a => a.status === 'rejected').length;
    }
    
    function applyToInternship(internship) {
        const newApplication = {
            id: Date.now(),
            company: internship.company,
            position: internship.title,
            status: 'under-review',
            appliedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            details: 'Application successfully submitted. The hiring team will review your profile shortly.'
        };
        userApplications.unshift(newApplication);
        populateApplications();
        modal.style.display = 'none';
        showNotification(`Application for ${internship.title} submitted!`, 'success');
        switchSection('applications');
    }
    
    
    function initializeModal() {
        [closeModalBtn, cancelBtn].forEach(el => el.addEventListener('click', () => modal.style.display = 'none'));
        window.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    function openApplicationModal(internship) {
        modalMessage.textContent = `Are you sure you want to apply for the ${internship.title} role at ${internship.company}?`;
        modal.style.display = 'block';
        confirmBtn.onclick = () => applyToInternship(internship);
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
        
        const baseColor = type === 'success' ? '#10b981' : type === 'error' ? '#dc3545' : '#0dcaf0';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = baseColor;
        notification.style.color = 'white';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        notification.style.zIndex = '3000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '1rem';
        notification.style.animation = 'slideInRight 0.4s ease';

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease forwards';
            notification.addEventListener('animationend', () => notification.remove());
        }, 4000);
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);


    
    initializeDashboard();
});
