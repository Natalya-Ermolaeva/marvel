const Spinner = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            style={{margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto'}} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <path d="M30 50A20 20 0 0 0 70 50A20 22 0 0 1 30 50" fill="#9f0013" stroke="none">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
            </path>
        </svg>
    )
}

export default Spinner;