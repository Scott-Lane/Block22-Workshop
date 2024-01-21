const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';


// function renderAllParties(parties){
//   let htmlString = "";
//   parties.forEach(party=> {
//     htmlString += `<p>${party.name}</p>`;
//   });
//   partyContainer.innerHTML = htmlString;
// }
function renderAllParties(parties) {
  let htmlString = '';
  parties.forEach((party) => {
    htmlString += `<div>
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
      <button class="details-button" data-id="${party.id}">See Details</button>
      <button class="delete-button" data-id="${party.id}">Delete</button>
    </div>`;
  });
  partyContainer.innerHTML = htmlString;
}

const getAllParties = async () => {
  try {
    const response = await fetch(`${PARTIES_API_URL}`);
    const parties = await response.json();
    renderAllParties(parties);
    return parties;
  } catch (error) {
    console.error(error);
  }
};



const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};


getAllParties();

async function renderPartyDetails(partyId) {
  try {
  const partyDetails = await getPartyById(partyId);
  renderSinglePartyById(partyDetails);
  console.log(party);
  } catch {
  console.error(error);
  }
};

function renderAllParties(parties) {
  let htmlString = "";
  parties.forEach((party) => {
    htmlString += `<div>
    <h2>${party.name}</h2>
    <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
    <button class="details-button" data-id="${party.id}">Details</button>
    <button class="delete-button" data-id=${party.id}">Delete</button>
    </div>`
  });
  partyContainer.innerHTML = htmlString;


const detailsButtons = document.querySelectorAll('.details-button');
detailsButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const partyId = event.target.getAttribute('data-id');
    await renderSinglePartyById(partyId);
  });
});

const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const partyId = event.target.getAttribute('data-id');
    await deleteParty(partyId);
  });
});
}



getAllParties()
.then(renderAllParties)
.catch(error => {
console.error(error);
});


const deleteParty = async (id) => {
  try {
    const res = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: "DELETE"
    })
    const json = await res.json();
    console.log(json);
  } catch(err) {
    console.error(err)
  }
};


const renderSinglePartyById = async (id) => {
  try {
    partyContainer.innerHTML = '';
    
    const party = await getPartyById(id);
    console.log(party);
    
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.description}</p>
            <p>${party.location}</p>
            <p>${party.date}</p>
            <p>${party.time}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join('')}
          </ul>
          


            <button class="close-button">Close</button>
        `;
    partyContainer.appendChild(partyDetailsElement);

    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
      const updatedParties = getAllParties();
      renderParties(updatedParties);
    });
  } catch (error) {
    console.error(error);
  }
};

const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);

      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        renderSinglePartyById(party.id);
        console.log(party)
      });

      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        await deleteParty(party.id);
        const parties = await getAllParties();
        partyContainer.innerHTML = "";
        renderParties(parties);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  const parties = await getAllParties();
  renderParties(parties);
};

init();
