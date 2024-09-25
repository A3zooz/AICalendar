import Together from 'together-ai'
import dotenv from 'dotenv'
dotenv.config()

const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;
const together = new Together({apiKey: TOGETHER_AI_API_KEY});


async function parseAvailability(text){
    const prompt = `
    Parse the following availability statement and return a JSON object with the following structure:

{

"Monday": [["start time", "end time"], ...],

"Tuesday": [["start time", "end time"], ...],

"Wednesday": [["start time", "end time"], ...],

"Thursday": [["start time", "end time"], ...],

"Friday": [["start time", "end time"], ...],

"Saturday": [["start time", "end time"], ...],

"Sunday": [["start time", "end time"], ...] <- this bracket is important

}

Use 24-hour time format (e.g., "14:00" instead of "2:00 PM").

midnight is 24:00 not 00:00
If a day is not mentioned neither explicitly or not explicitly please set it to 25:00 25:00

Availability statement: "${text}"

I ONLY WANT THE JSON OBJECT. ALSO WEEKENDS ARE FRIDAY AND SATURDAY ONLY NOT SUNDAY. SUNDAY IS A NORMAL DAY
and please don't forget any brackets    `

    try {
        const response = await together.chat.completions.create({
            model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
            messages: [{role: "user", content: prompt}],
        });
        
        const availability = response.choices[0].message.content;
        console.log("Availability with OpenAI:", availability);
        const jsonString = availability.substring(availability.indexOf('{'), availability.lastIndexOf('}') + 1).trim();
        console.log(jsonString)
        return JSON.parse(jsonString);
        

        } catch (error) {
        console.error("Error parsing availability with OpenAI:", error);
        throw error;
        }
    }
export {parseAvailability};