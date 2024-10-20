
//theme selection changer code
const savedTheme = document.getElementById('savedData')

const theme = document.getElementById('themeSelector');
theme.addEventListener('change', function(){
  const themeText = this.value;
  console.log(themeText);

  document.body.classList.remove('light-theme', 'dark-theme', 'pastel-theme');

  if(themeText === 'light'){
    document.body.classList.add('light-theme');
  } else if(themeText === 'dark'){
    document.body.classList.add('dark-theme');
  }else if(themeText === 'pastel'){
    document.body.classList.add('pastel-theme');
  }
});

document.body.classList.add('light-theme');

// Save button logic
document.getElementById('saveBtn').addEventListener('click', function () {
  const form = document.forms['measurementForm'];
  const clientName = form['clientName'].value;
  const phoneNumber = form['phoneNumber'].value;
  const garmentName = form['garmentName'].value;
  const clientImage = document.getElementById('clientImage').files[0];

  if (clientName === "" || !clientImage) {
     alert("Please enter a client name and upload an image.");
     return;
  }

  // Save image to base64
  const reader = new FileReader();
  reader.onloadend = function () {
      const imageBase64 = reader.result;

      // Collect measurements
      const measurements = {
          clientName: clientName,
          phoneNumber: phoneNumber,
          garmentName: garmentName,
          image: imageBase64, // Save the base64 string of the image
          back: form['back'].value,
          sleeveLength: form['sleeveLength'].value,
          aroundArm: form['aroundArm'].value,
          chest: form['chest'].value,
          hip: form['hip'].value,
          topLength: form['topLength'].value,
          waist: form['waist'].value,
          thigh: form['thigh'].value,
          knee: form['knee'].value,
          bar: form['bar'].value,
          trouserLength: form['trouserLength'].value
      };

      // Save the data to localStorage
      try {
          let measurementsList = JSON.parse(localStorage.getItem('measurements')) || [];
          measurementsList.push(measurements);
          localStorage.setItem('measurements', JSON.stringify(measurementsList));

          // Display saved measurements
          displayMeasurements();
          form.reset(); // Clear the form
      } catch (e) {
          alert("Storage limit exceeded. Consider saving images externally.");
      }
  };

  reader.readAsDataURL(clientImage); // Start reading the image file
});

// Display measurements dynamically
function displayMeasurements() {
  const measurementsList = JSON.parse(localStorage.getItem('measurements')) || [];
  const savedDataDiv = document.getElementById('savedData');
  savedDataDiv.innerHTML = ''; // Clear previous content

  measurementsList.forEach((entry, index) => {
      const div = document.createElement('div');
      div.classList.add('measurement-entry');
      div.innerHTML = `
          <p><strong>${entry.clientName}</strong></p>
          <p>Phone: ${entry.phoneNumber}</p>
          <p>Garment: ${entry.garmentName}</p>
          <button onclick="viewDetails(${index})">View Full Details</button>
          <button onclick="deleteMeasurement(${index})" class="delete-btn">Delete</button>
      `;
      savedDataDiv.appendChild(div);
  });
}

// View full details in modal
function viewDetails(index) {
  const measurementsList = JSON.parse(localStorage.getItem('measurements')) || [];
  const entry = measurementsList[index];

  // Open the modal and display full details
  const modal = document.getElementById("historyModal");
  document.getElementById("clientModalName").innerText = entry.clientName;
  document.getElementById("modalContent").innerHTML = `
      <p><strong>Garment: ${entry.garmentName}</strong></p>
      <p>Back: ${entry.back} cm</p>
      <p>Sleeve Length: ${entry.sleeveLength} cm</p>
      <p>Around Arm: ${entry.aroundArm} cm</p>
      <p>Chest: ${entry.chest} cm</p>
      <p>Hip: ${entry.hip} cm</p>
      <p>Top Length: ${entry.topLength} cm</p>
      <p>Waist: ${entry.waist} cm</p>
      <p>Thigh: ${entry.thigh} cm</p>
      <p>Knee: ${entry.knee} cm</p>
      <p>Bar: ${entry.bar} cm</p>
      <p>Trouser Length: ${entry.trouserLength} cm</p>
      <img src="${entry.image}" alt="${entry.clientName}'s image" style="max-width: 100%; border-radius: 8px;" />
  `;
  modal.style.display = "block";
}

// Delete measurement logic
function deleteMeasurement(index) {
  let measurementsList = JSON.parse(localStorage.getItem('measurements')) || [];
  measurementsList.splice(index, 1); // Remove the measurement at the given index
  localStorage.setItem('measurements', JSON.stringify(measurementsList)); // Save updated list to localStorage
  displayMeasurements(); // Refresh the displayed measurements
}

// Modal close logic
document.querySelector(".close").onclick = function () {
  document.getElementById("historyModal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target === document.getElementById("historyModal")) {
      document.getElementById("historyModal").style.display = "none";
  }
};

// Display any saved measurements on load
displayMeasurements();
