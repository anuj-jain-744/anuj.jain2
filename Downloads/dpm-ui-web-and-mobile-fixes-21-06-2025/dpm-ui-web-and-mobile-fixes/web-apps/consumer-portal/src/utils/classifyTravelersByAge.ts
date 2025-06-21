import { getAge } from "./getAge";

interface Traveler {
    id: number;    
  }

export interface travelerAgeCounts{
    child:number;
    adult:number;
    senior:number;
}
export const classifyTravelersByAge = (travelers:Traveler[]): travelerAgeCounts =>{
    let child = 0;
    let adult = 0;
    let senior = 0;
    travelers.forEach((traveler)=>{
        const age = getAge(traveler?.dob);
        if(age>= 0.25 && age <18){
            child++;
        }else if(age>=18 && age<65){
            adult++
        }else if(age>=65){
            senior++
        }
    })
    return{child, adult, senior}
}