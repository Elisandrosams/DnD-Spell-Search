const spellListEl = document.querySelector('.spell-list')
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
})

maxInput.addEventListener('input', () => {
    if(parseInt(maxInput.value) <= parseInt(minInput.value)) {
        minInput.value = maxInput.value;
    }
    updateProgress()
})
updateProgress()



async function allSpells() {
    const spells = await fetch(`https://www.dnd5eapi.co/api/2014/spells`)
    const spellsData = await spells.json();
    const {results, ...details} = spellsData;
    spellListEl.innerHTML = results.map((spells) => spellHTML(spells)).join("");
}
allSpells()


function spellHTML(spells) {
    return `<div class="spell-card">
              <div class="spell-card__container">
                <h3>Spell Name: ${spells.index}</h3>
                <p><b>Level: ${spells.level}</b></p>
                <p><button id="${spells.index}">See Reverse for Description</button></p>
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
console.log(spellRange())

//const sliderHandles = [
//    document.getElementById('min-input'),
//    document.getElementById('max-input')
//];
//sliderHandles.forEach(handle => {
//    handle.addEventListener('input', (e) => {
//        const [minVal, maxVal] = sliderHandles.map(h => parseFloat(h.value))
//        console.log(`${minVal} - ${maxVal}`)
//    })
//})

//const button = document.getElementById('${spells.index}');
//const spellCardInfo = document.getElementById('spell-card__info--container');

//async function spellInfo() {
//    const result = await fetch(`https://www.dnd5eapi.co/api/2014/spells/${spells.index}`)
//    const info = await result.json();
//    console.log(result)
//}
//button.addEventListener('click', spellInfo)