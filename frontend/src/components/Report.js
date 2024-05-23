import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';

function Report() {
  const location = useLocation();
  const responseData = location.state?.responseData;
  // const responseData = {
  //   "exec_time": 7,
  //   "is_auth": true,
  //   "links": [
  //     "http://192.168.56.101/dvwa/dvwa/css/main.css",
  //     "http://192.168.56.101/dvwa/favicon.ico",
  //     "http://192.168.56.101/dvwa/",
  //     "http://192.168.56.101/dvwa/instructions.php",
  //     "http://192.168.56.101/dvwa/setup.php",
  //     "http://192.168.56.101/dvwa/vulnerabilities/brute/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/exec/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/csrf/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/fi/?page=include.php",
  //     "http://192.168.56.101/dvwa/vulnerabilities/sqli/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/sqli_blind/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/upload/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/xss_r/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/xss_s/",
  //     "http://192.168.56.101/dvwa/security.php",
  //     "http://192.168.56.101/dvwa/phpinfo.php",
  //     "http://192.168.56.101/dvwa/phpinfo.php?=PHPB8B5F2A0-3C92-11d3-A3A9-4C7B08C10000",
  //     "http://192.168.56.101/dvwa/about.php",
  //     "http://192.168.56.101/dvwa/instructions.php?doc=PHPIDS-license",
  //     "http://192.168.56.101/dvwa/instructions.php?doc=readme",
  //     "http://192.168.56.101/dvwa/instructions.php?doc=changelog",
  //     "http://192.168.56.101/dvwa/instructions.php?doc=copying",
  //     "http://192.168.56.101/dvwa/security.php?phpids=on",
  //     "http://192.168.56.101/dvwa/security.php?phpids=off",
  //     "http://192.168.56.101/dvwa/security.php?test=%22><script>eval(window.name)</script>",
  //     "http://192.168.56.101/dvwa/ids_log.php"
  //   ],
  //   "links_with_vulns": [
  //     "http://192.168.56.101/dvwa/vulnerabilities/xss_r/",
  //     "http://192.168.56.101/dvwa/vulnerabilities/xss_s/"
  //   ],
  //   "nbr_all_vuln": 2,
  //   "nbr_forms": 14,
  //   "nbr_links": 26,
  //   "nbr_xss_in_form": 2,
  //   "nbr_xss_in_link": 0,
  //   "cves" : ["https://nvd.nist.gov/vuln/detail/cve-2023-30777"]
  // }

  // Utilisez les données de responseData pour préparer les données pour le graphique
  const data = {
    labels: ['Links with Vulnerabilities', 'Links without Vulnerabilities'],
    datasets: [{
      label: 'Links',
      data: [responseData.links_with_vulns.length, responseData.nbr_links - responseData.links_with_vulns.length],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };

  const Histdata = {
    labels: ['Forms', 'Links'],
    datasets: [{
      label: 'Number of Vulnerabilities',
      data: [responseData.nbr_xss_in_form, responseData.nbr_xss_in_link],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };
  const histRef = useRef(null);
  const histInstance = useRef(null);

  useEffect(() => {
    if (histInstance.current !== null) {
      histInstance.current.destroy();
    }

    const ctx = histRef.current.getContext('2d');
    histInstance.current = new Chart(ctx, {
      type: 'bar',
      data: Histdata,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (histInstance.current !== null) {
        histInstance.current.destroy();
      }
    };
  }, [Histdata]);


  // Créez une référence pour le graphique
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Référence pour le graphique Chart.js

  useEffect(() => {
    // Vérifiez si le graphique existe déjà
    if (chartInstance.current !== null) {
      // Détruisez le graphique existant
      chartInstance.current.destroy();
    }
    // Créez le graphique une fois que le composant est monté
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: data,
    });
    // Assurez-vous de détruire le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Detailed Report 📔</h1>
        </div>
        <div className="flex flex-wrap justify-between mb-8">
          <div className="bg-white rounded-lg shadow-md w-1/2 px-6 py-4 mb-4">
            <div className="flex items-center mb-4">
              <h2 className="font-bold mr-2">Execution Time:</h2>
              <p className="text-3xl">{responseData.exec_time}s</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md w-1/2 px-6 py-4 mb-4">
            <div className="flex justify-center mb-4">
              <h2 className="font-bold">Authentification Test:</h2>
            </div>
            <div className="flex justify-center mb-8">
              <h2 className="font-semibold">{responseData.is_auth ? "Yes" : "No"}</h2>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md w-1/2 px-6 py-4 ml-2 overflow-y-auto max-h-60">
            <h3 className="font-bold mb-4">CVEs:</h3>
            <ul className="list-disc pl-4">
              {responseData.cves.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex mb-8">
          <div className="bg-white rounded-lg shadow-md w-1/2 px-6 py-4 mr-2 overflow-y-auto max-h-60">
            <h3 className="font-bold mb-4">List of Links:</h3>
            <ul className="list-disc pl-4">
              {responseData.links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md w-1/2 px-6 py-4 ml-2 overflow-y-auto max-h-60">
            <h3 className="font-bold mb-4">List of Links with Vulnerabilities:</h3>
            <ul className="list-disc pl-4">
              {responseData.links_with_vulns.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <div className="flex w-1/2 flex-col">
            <div className="bg-white rounded-lg shadow-md w-full px-6 py-4 mb-4">
              <h3 className="font-bold mb-2">Forms Tested:</h3>
              <p>{responseData.nbr_forms}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md w-full px-6 py-4">
              <h3 className="font-bold">Links Tested:</h3>
              <p>{responseData.nbr_links}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md w1/2 ml-3 py-8">
              <div className="container mx-auto px-4">
                <canvas ref={histRef}></canvas>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md w1/2 ml-3 py-8">
          <canvas ref={chartRef} className="w-3/4 mx-auto"></canvas>
        </div>
        </div>
      </div>
    </>

  )
}

export default Report;
