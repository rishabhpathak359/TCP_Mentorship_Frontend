import Problem from "./Problem";
import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { FaSpinner } from 'react-icons/fa';

const ProblemList = ({toggleConfetti }) => {
  const [questions, setQuestions] = useState([]);
  const [solved,setSolved] = useState(false);
  const [id, setId] = useState(null);
  const mentor = JSON.parse(localStorage.getItem("Mentor"));
  const mentee = JSON.parse(localStorage.getItem("Mentee"));
  useEffect(() => {
    if (mentor) {
      setId(mentor.id);
    } else if (mentee) {
      setId(mentee.mentor_id);
    }
  }, [mentor, mentee]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await fetchDataFromApi("getQuestions", id);
      console.log(data.data)
      console.log("Data" , data.data[0].submittedmenteeId.includes(mentee.id))
      setQuestions(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      setLoading(false);
    }
  };
  console.log(questions)
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-black dark:text-white pt-7 pb-5 font-semibold">
        Problems Assigned
      </h1>
      {loading ? (
        <div className="flex items-center justify-center text-black  dark:text-gray-400">
          <FaSpinner className="animate-spin text-4xl mr-2" />
          Loading...
        </div>
      ) : questions.length === 0 ? (
        <p className=" text-center text-black dark:text-gray-500 text-2xl">
          No questions assigned yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {questions.map((question) => (
            <Problem
              key={question.id}
              Qstatus={question?.submittedmenteeId?.includes(String(mentee.id))}
              id={question.id}
              toggleConfetti={toggleConfetti}
              title={question.Qname}
              topic={question.topic}
              level={question.Level}
              desc={question.desc}
              url={question.problemLink}
              time={question.formated_allotedtime}
              user={mentee || mentor}
            />
            
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
