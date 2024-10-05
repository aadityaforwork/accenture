
function createInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.style.position = 'fixed';
    installPrompt.style.top = '20px';  // Changed to top for better visibility
    installPrompt.style.left = '50%';   // Center horizontally
    installPrompt.style.transform = 'translateX(-50%)'; // Center adjustment
    installPrompt.style.width = '300px';
    installPrompt.style.padding = '15px';
    installPrompt.style.backgroundColor = 'white';
    installPrompt.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    installPrompt.style.borderRadius = '8px';
    installPrompt.style.zIndex = '9999';
    installPrompt.id = 'install-prompt';
    
    // Use backticks to create a template literal for HTML content
    installPrompt.innerHTML = `
        <h2>Enhance Your Experience!</h2>
        <p>Install our Chrome extension for better features.</p>
        <button id="install-button">Install Extension</button>
        <button id="close-prompt">Close</button>
    `;

    // Add event listener to the install button
    installPrompt.querySelector('#install-button').addEventListener('click', () => {
        window.open('https://chrome.google.com/webstore/detail/kfmhibmoiioheddeojndhdfifakgcknn', '_blank'); // Replace with your extension URL
    });

    // Add event listener to close the prompt
    installPrompt.querySelector('#close-prompt').addEventListener('click', () => {
        installPrompt.remove();
    });

    // Append the prompt to the body
    document.body.appendChild(installPrompt);
}

// Check if the install prompt already exists to avoid duplicates
if (!document.getElementById('install-prompt')) {
    createInstallPrompt();
}
