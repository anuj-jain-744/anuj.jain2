export function getFullAge(dateOfBirth: string, seprator: string): number {
    try {
        if (!dateOfBirth) {
            return 0;
        }
        const [day, month, year] = dateOfBirth.split(seprator);
        const dob = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();
        
        let age = today.getFullYear() - dob.getFullYear();
        
        if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }
        
        return age;
    } catch (error) {
        return 0;
    }
    
}