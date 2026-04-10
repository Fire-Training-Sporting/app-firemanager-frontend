export function Input({label, type, placeholder, id}){
    return(
        <div className="bg-stone-700 p-8">
            <label className="block text-white text-md font-bold">
                {label}:
            </label>
            <input id={id} type={type} placeholder={placeholder} className="bg-white rounded-md p-1.5 outline-0 focus:border-orange-500"/>
        </div>
    )
}