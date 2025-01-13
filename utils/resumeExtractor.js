// Helper function to read and extract text from the PDF
const extractResumeData = async (cvText) => {
  // Extract key information
  const name = extractName(cvText);
  const contactInfo = extractContactInfo(cvText);
  const skills = extractSkills(cvText);
  const experience = extractExperience(cvText);
  const education = extractEducation(cvText);
  const projects = extractProjects(cvText);
  const certifications = extractCertifications(cvText);
  const languages = extractLanguages(cvText);
  const hobbies = extractHobbies(cvText);

  return {
    name,
    contactInfo,
    skills,
    experience,
    education,
    projects,
    certifications,
    languages,
    hobbies,
  };
};

// 1. Extracting Name
const extractName = (cvText) => {
  const nameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/; // Matches names like "John Doe"
  const nameMatch = cvText.match(nameRegex);
  return nameMatch ? nameMatch[0] : "Name not found";
};

// 2. Extracting Contact Information (Phone, Email, LinkedIn, etc.)
const extractContactInfo = (cvText) => {
  const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/; // Matches phone numbers
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/; // Matches emails
  const linkedInRegex =
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/; // Matches LinkedIn profile URLs

  const phone = cvText.match(phoneRegex)
    ? cvText.match(phoneRegex)[0]
    : "Phone not found";
  const email = cvText.match(emailRegex)
    ? cvText.match(emailRegex)[0]
    : "Email not found";
  const linkedin = cvText.match(linkedInRegex)
    ? cvText.match(linkedInRegex)[0]
    : "LinkedIn not found";

  return { phone, email, linkedin };
};

// 3. Extracting Skills (listed as bullet points or comma-separated)
const extractSkills = (cvText) => {
  const skillsRegex = /(?:Skills?|Technologies?|Tools?):\s*([\w,.\-+\s]+)/i;
  const skillsMatch = cvText.match(skillsRegex);
  return skillsMatch
    ? skillsMatch[1].split(",").map((skill) => skill.trim())
    : [];
};

// 4. Extracting Work Experience (Looking for "Experience" and job-related sections)
const extractExperience = (cvText) => {
  const experienceRegex =
    /(?:Experience|Work Experience|Professional Experience)[\s\S]+?(\d{4}[-\s]+\d{4}|\d{4})/i;
  const experienceMatch = cvText.match(experienceRegex);
  if (experienceMatch) {
    const experienceText = experienceMatch[0].trim();
    const jobRegex =
      /(?:Company|Organization|Employer):?\s*([^\n]+)\s*[\-\|]*\s*(.*?)(?=\n[\-\|\*])/g;
    const jobs = [];
    let job;
    while ((job = jobRegex.exec(experienceText)) !== null) {
      jobs.push({
        company: job[1].trim(),
        role: job[2].trim(),
        period: job[3]?.trim() || "Not available",
        description: job[4]?.trim() || "No description available",
      });
    }
    return jobs;
  }
  return [];
};

// 5. Extracting Education (Degree, University, Graduation Year)
const extractEducation = (cvText) => {
  const educationRegex =
    /(?:Education|Academic Background)[\s\S]+?\b(?:Bachelor|Master|Ph\.?D|Degree)/i;
  const educationMatch = cvText.match(educationRegex);
  return educationMatch ? educationMatch[0].trim() : "Education not found";
};

// 6. Extracting Projects (Looking for "Projects" or "Personal Projects")
const extractProjects = (cvText) => {
  const projectsRegex =
    /(?:Projects?|Key Achievements?|Personal Projects?):\s*([\s\S]+?)(?=\n(?:Experience|Education|Skills))/i;
  const projectsMatch = cvText.match(projectsRegex);
  return projectsMatch
    ? projectsMatch[1].split("\n").map((project) => project.trim())
    : [];
};

// 7. Extracting Certifications (Certifications or Achievements)
const extractCertifications = (cvText) => {
  const certificationsRegex =
    /(?:Certifications?|Achievements?):\s*([\s\S]+?)(?=\n(?:Experience|Education|Skills))/i;
  const certificationsMatch = cvText.match(certificationsRegex);
  return certificationsMatch
    ? certificationsMatch[1].split("\n").map((cert) => cert.trim())
    : [];
};

// 8. Extracting Languages
const extractLanguages = (cvText) => {
  const languagesRegex = /(?:Languages?):\s*([\w,.\-+\s]+)/i;
  const languagesMatch = cvText.match(languagesRegex);
  return languagesMatch
    ? languagesMatch[1].split(",").map((language) => language.trim())
    : [];
};

// 9. Extracting Hobbies/Interests
const extractHobbies = (cvText) => {
  const hobbiesRegex =
    /(?:Hobbies?|Interests?):\s*([\s\S]+?)(?=\n(?:Experience|Education|Skills))/i;
  const hobbiesMatch = cvText.match(hobbiesRegex);
  return hobbiesMatch
    ? hobbiesMatch[1].split("\n").map((hobby) => hobby.trim())
    : [];
};
export default extractResumeData;
