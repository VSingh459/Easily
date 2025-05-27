import fs from 'fs';
import path from 'path';

const recruitersFilePath = path.join(path.resolve(), 'src', 'models', 'recruiter.json');

export default class ScoutModel {
  // Read recruiters data from JSON file
  static readRecruiters() {
    try {
      const data = fs.readFileSync(recruitersFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading recruiters file:", error);
      return [];  // Return an empty array if there's an error or file doesn't exist
    }
  }

  // Write recruiters data to JSON file
  static writeRecruiters(recruiters) {
    try {
      fs.writeFileSync(recruitersFilePath, JSON.stringify(recruiters, null, 2));
    } catch (error) {
      console.error("Error writing to recruiters file:", error);
    }
  }

  // Example method to add a new recruiter
  static addRecruiter(name, email, company, position) {
    const recruiters = this.readRecruiters();
    const newRecruiter = {
      id: recruiters.length + 1,
      name,
      email,
      company,
      position
    };
    recruiters.push(newRecruiter);
    this.writeRecruiters(recruiters);
    return newRecruiter;
  }

  // Example method to get all recruiters
  static getAllRecruiters() {
    return this.readRecruiters();
  }
}
