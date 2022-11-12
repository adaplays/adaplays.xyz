// with help from https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import { Heading } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = (deadline: number, setTimerDone: Dispatch<SetStateAction<boolean>>) => {

  const [time, setTime] = useState(Math.max(deadline - Date.now(), 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          setTimerDone(true)
          clearInterval(interval)
          return 0
        } else {
          return (deadline - Date.now())
        }
      })
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, setTimerDone]);

  return (
    <>
      {Object.entries({
          Days: time / DAY,
          Hours: (time / HOUR) % 24,
          Minutes: (time / MINUTE) % 60,
          Seconds: (time / SECOND) % 60,
      }).map(([label, value]) => (
        <Heading key={label} variant='brand'>
          {label} {"  "} {`${Math.floor(value)}`.padStart(2, "0")}
        </Heading>
      ))}
    </>
  );
};
// {/* Days: {time / DAY}, Hours: {(time / HOUR) % 24}, Minutes: {(time / MINUTE) % 60}, Seconds: {(time / SECOND) % 60} */}
