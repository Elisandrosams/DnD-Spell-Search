const spellListEl = document.querySelector('.spell-list');

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



async function main() {
    const spells = await fetch("https://www.dnd5eapi.co/api/2014/spells?level=")
    const spellsData = await spells.json();
    console.log(spellsData)
}
main()

