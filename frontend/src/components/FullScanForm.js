import React, { useState } from 'react';
import Header from './Header';
import { useNavigate } from "react-router-dom";

function FullScanForm() {
  const [targetUrl, setTargetUrl] = useState('');
  const [linksToIgnore, setLinksToIgnore] = useState([]);
  const [testAuth, setTestAuth] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const [creds, setCreds] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      target_url: targetUrl,
      links_to_ignore: linksToIgnore,
      test_auth: testAuth,
    }
    if (testAuth) {
      data.auth_infos = {
        url: loginUrl,
        cred: JSON.parse(creds)
      }
    }
    console.log(data);
    try {
      const response = await fetch('http://127.0.0.1:5001/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      // Log response or handle it as needed
      const responseData = await response.json();
      console.log('Response:', responseData);
      navigate('/report', {state : {responseData}})
    } catch (error) {
      setLoading(false)
      alert("Error, verify your request before sending")
      console.error('Error submitting data:', error.message);
    } finally {
      setLoading(false)
    }

    // Log data or send it to the server
    console.log(data);
  };

  return (
    <>
    <div>
      <Header />
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <label htmlFor="targetUrl">Target URL</label>
          <input className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" type="text" id="targetUrl" placeholder='http://exemple:port' name="targetUrl" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="linksToIgnore">Links to ignore</label>
          <input className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" type="text" id="linksToIgnore" placeholder='["http://exemple:port", ...]' name="linksToIgnore" value={linksToIgnore} onChange={(e) => setLinksToIgnore(e.target.value)} />
        </div>
        <div className="flex items-center justify-around">
          <label>Try to authenticate?</label>
          <input className="form-checkbox h-5 w-5 text-gray-600 border border-gray-300 rounded-md checked:bg-gray-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-0 focus:ring-offset-transparent" type="checkbox" id="testAuth" name="testAuth" checked={testAuth} onChange={(e) => setTestAuth(e.target.checked)} />
        </div>
        {testAuth && (
          <div id="authFields" className='flex flex-col'>
            <label htmlFor="loginUrl">Login URL</label>
            <input className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" type="text" id="loginUrl" name="loginUrl" placeholder='http://exemple:port' value={loginUrl} onChange={(e) => setLoginUrl(e.target.value)} required />
            <label htmlFor="creds">Cred json</label>
            <input className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mt-1" type="text" id="creds" name="creds" placeholder='{}' value={creds} onChange={(e) => setCreds(e.target.value)} required />
          </div>
        )}
        <div className='flex justify-center'>
          <button type="submit" className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-0 focus:ring-offset-transparent">Submit</button>
        </div>
      </form>
    </div>
    {loading ? (
          <div className='flex justify-center text-align space-x-2 m-5' role="status">
          <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-black " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span>Sending data, should take few minutes (you will be redirected)...</span>
        </div>) : (<></>)
      }
    </>
  );
}

export default FullScanForm;
