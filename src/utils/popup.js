const getPopupHTML = ({ title }) => {
    return `<div class="marker-popup">
        <p>${title}</p>
        <button class="btn">Do Thing</button>
    </div>`
}

export {
    getPopupHTML
}