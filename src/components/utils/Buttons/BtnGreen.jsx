export function BtnGreen({ content, className = "", type = "button" }) {
    return(
        <>
            <button type={type} className={`bg-green-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer ${className}`.trim()}>
                {content}
            </button>
        </>
    )
}