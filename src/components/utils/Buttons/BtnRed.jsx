export function BtnRed({content}){
    return(
        <>
            <button className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
                {content}
            </button>
        </>
    )
}