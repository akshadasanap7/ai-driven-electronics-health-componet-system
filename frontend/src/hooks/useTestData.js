import { useState, useEffect, useRef, useCallback } from 'react';
import { acquireMeasurement, getMeasurements, runDiagnosis, getTest } from '../services/api';

export function useTestData(testId, active = false) {
  const [measurements, setMeasurements] = useState([]);
  const [latest, setLatest] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [test, setTest] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const poll = useCallback(async () => {
    if (!testId) return;
    try {
      const m = await acquireMeasurement(testId);
      setLatest(m);
      setMeasurements(prev => [...prev.slice(-49), m]);
    } catch (e) {
      setError(e.message);
    }
  }, [testId]);

  useEffect(() => {
    if (!testId) return;
    getTest(testId).then(setTest).catch(() => {});
    getMeasurements(testId).then(ms => {
      setMeasurements(ms);
      if (ms.length) setLatest(ms[ms.length - 1]);
    }).catch(() => {});
  }, [testId]);

  useEffect(() => {
    if (active && testId) {
      intervalRef.current = setInterval(poll, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [active, testId, poll]);

  const finalize = useCallback(async () => {
    clearInterval(intervalRef.current);
    if (!testId) return;
    try {
      const d = await runDiagnosis(testId);
      setDiagnosis(d);
      return d;
    } catch (e) {
      setError(e.message);
    }
  }, [testId]);

  return { measurements, latest, diagnosis, test, error, finalize };
}
