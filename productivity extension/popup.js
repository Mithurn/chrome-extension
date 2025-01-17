document.addEventListener('DOMContentLoaded', () => {
    const timeList = document.getElementById('timeList');
  
    chrome.runtime.sendMessage({ action: 'getTimeSpent' }, (response) => {
      if (!response || Object.keys(response).length === 0) {
        timeList.innerHTML = '<p>No data available</p>';
        return;
      }
  
      const colors = ['grey', 'grey', 'grey', 'grey', 'grey']; // Color palette

      let index = 0;
  
      for (const site in response) {
        const timeInSeconds = response[site];
        const timeInMinutes = Math.floor(timeInSeconds / 60);
  
        // Create a container for the site's time bar and name
        const div = document.createElement('div');
        div.classList.add('site-time');
  
        const barColor = colors[index % colors.length];
        const barWidth = Math.min(timeInSeconds / 3600, 1) * 100;
  
        div.innerHTML = `
          <div class="site-info">
            <span class="website">${site}</span>
            <span class="time">${timeInMinutes} min</span>
          </div>
          <div class="time-bar-container">
            <div class="time-bar" style="width: ${barWidth}%; background-color: ${barColor};" data-site="${site}"></div>
          </div>
        `;
  
        timeList.appendChild(div);
  
        // Add click event to set a time limit for the website
        div.querySelector('.time-bar').addEventListener('click', () => {
          const limit = prompt(`Set a daily time limit for ${site} (in minutes):`, "0");
          if (limit !== null && !isNaN(limit)) {
            chrome.storage.local.set({ [`limit_${site}`]: parseInt(limit, 10) }, () => {
              alert(`Time limit for ${site} is set to ${limit} minutes.`);
            });
          } else {
            alert('Invalid input. Please enter a number.');
          }
        });
  
        index++;
      }
    });
  });
  