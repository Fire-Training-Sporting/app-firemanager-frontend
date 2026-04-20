export function BtnGreen({content, onClick}){
    return(
        <>
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer" onClick={onClick}>
                {content}
            </button>
        </>
    )
}