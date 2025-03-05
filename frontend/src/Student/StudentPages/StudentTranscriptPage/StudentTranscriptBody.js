import React from 'react';

const StudentTranscriptBody= ({studentId}) => {
/* Call to get all the coursesss in which the student is enrolled
      const dbResponseTranscript = await fetch(`http://localhost:5000/api/transcripts/${studentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });

      if (!dbResponseTranscript.ok) {
        throw new Error(`Failed to fetch transcript. Status: ${dbResponseTranscript.status}`);
      }

      const transcriptHash = await dbResponseTranscript.json();
      console.log("Got this transcript: ", transcriptHash);
*/

  return (
    <div>
      <p> Student Transcript Body</p>
    </div>
  );
};



export default StudentTranscriptBody;
