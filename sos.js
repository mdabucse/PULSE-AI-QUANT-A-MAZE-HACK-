import fs from 'fs/promises';
import twilio from 'twilio';

// Twilio credentials
const accountSid = 'YOUR-ID';
const authToken = 'YOUR-ID';
const client = new twilio(accountSid, authToken);

export async function makeCall() {
  try {
    const data = await fs.readFile('A:/Projects/Vital Monitoring/From_Scratch/model/Data/apgar_summary.txt', 'utf8');
    const customMessage = data.trim();
    console.log(`Sending SOS Message: ${customMessage}`);

    const call = await client.calls.create({
      to: '+919578737494',
      from: '+12563049749',
      twiml: `<Response><Say>${customMessage}</Say></Response>`,
    });

    console.log('Call SID:', call.sid);
    return call.sid; 
  } catch (error) {
    console.error('Error in makeCall:', error);
    throw error; 
  }
}
