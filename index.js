const spellListEl = document.querySelector('.spell-list')
const spellInfoEl = document.querySelector('.spell-card__info--container')
const slider = document.querySelector(".range-slider");
const progress = slider.querySelector(".progress");
const minLevelInput = slider.querySelector(".min-level")
const maxLevelInput = slider.querySelector(".max-level")
const minInput = slider.querySelector(".min-input")
const maxInput = slider.querySelector(".max-input")

const updateProgress = () => {
    const minValue = parseInt(minInput.value)
    const maxValue = parseInt(maxInput.value)

    const range = maxInput.max - minInput.min;//total range of slider
    const valueRange = maxValue - minValue;//selected value range
    const width = valueRange / range * 100;//calculate width percentage
    const minOffset = ((minValue - minInput.min) / range) * 100;//calculate min thumb offset


    progress.style.width = width + "%";//update progress width
    progress.style.left = minOffset + "%";//update progress left position

    minLevelInput.value = minValue;//update min number
    maxLevelInput.value = maxValue;//update max number
}

const updateRange = (event) => {
    const input = event.target;

    let min = parseInt(minLevelInput.value);
    let max = parseInt(maxLevelInput.value);

    if(input === minLevelInput && min > max) {
        max = min;
        maxLevelInput.value = max;
    } else if(input === maxLevelInput && max < min) {
        min = max;
        minLevelInput.value = min;
    }

    minInput.value = min;
    maxInput.value = max;

    updateProgress();
}


minLevelInput.addEventListener('input', updateRange)
maxLevelInput.addEventListener('input', updateRange)

minInput.addEventListener('input', () => {
    if(parseInt(minInput.value) >= parseInt(maxInput.value)) {
        maxInput.value = minInput.value;
    }
    updateProgress()
    spellRange()
    allSpells()
})

maxInput.addEventListener('input', () => {
    if(parseInt(maxInput.value) <= parseInt(minInput.value)) {
        minInput.value = maxInput.value;
    }
    updateProgress()
    spellRange()
    allSpells()
})
updateProgress()



async function allSpells(filter) {
    const spells = await fetch(`https://www.dnd5eapi.co/api/2014/spells?level=${spellRange()}`)
    const spellsData = await spells.json();
    const {results, ...details} = spellsData;
    spellListEl.innerHTML = results.map((spells) => spellHTML(spells)).join("");
    console.log(results)
}
allSpells()


function spellHTML(spells) {
    return `<div data-name="${spells.name}" data-num="${spells.level}" class="spell-card column">
              <div class="spell-card__container">
                <h1>${spells.name}</h1>
                <p id="${spells.level}"><b>Level: ${spells.level}</b></p>
                <button class= "api-btn" id="${spells.index}">See Reverse for Description</button>
              </div>
            </div>`
}

function spellRange(){
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    const start = Math.min(min, max);
    const end = Math.max(min, max);
    
    return Array.from({length: end - start + 1}, (_, i) => start + i);
}

document.body.addEventListener('click', async (event) => {
    const button = event.target.closest(".api-btn");
    if (event.target.classList.contains('api-btn')) {
        const buttonId = button.id;
        const result = await fetch(`https://www.dnd5eapi.co/api/2014/spells/${buttonId}`)
        const info = await result.json();
        console.log(info)
        const descList = info.desc.map(description => `<li>${description}</li>`).join('')
        document.querySelector(".spell-card__info--container").innerHTML = `
  <h2>${info.name}</h2>
  <p><b>Level: ${info.level}</b></p>
  <p><b>Casting Time:</b> ${info.casting_time}</p>
  <p><b>Range: </b>${info.range}</p>
  <p><b>Description: </b><ul>${descList}</ul></p>
`;}
});

function sortSpells() {
    const dropDown = document.getElementById("filter");
    const container = document.getElementById("spell-list");
    const divs = Array.from(container.querySelectorAll(".spell-card"));
    if (dropDown.value === "LOW_TO_HIGH") {
        divs.sort((a, b) => Number(a.dataset.num) - Number(b.dataset.num));
    }
    else if (dropDown.value === "HIGH_TO_LOW") {
        divs.sort((a, b) => Number(b.dataset.num) - Number(a.dataset.num));
    }
    else if (dropDown.value === "ALPHABETICAL") {
        divs.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    }
    divs.forEach(div => container.appendChild(div));
}



       
    