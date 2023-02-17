export default function Announcement() {
    return <section className='px-8 pb-4 text-center text-xs'>
        <div className='flex items-center justify-center py-4'>
            <a href="https://davincigraph.io" rel="noreferrer" target="_blank">
                <div style={{ backgroundImage: "url('./davincigraph.jpg')", backgroundSize: "cover", borderRadius: '50%', width: 48, height: 48, margin: 5 }}></div>
            </a>
            <a href="https://www.hashpack.app" rel="noreferrer" target="_blank">
                <div style={{ backgroundImage: "url('./hashpack.jpg')", backgroundSize: "cover", borderRadius: '50%', width: 48, height: 48, margin: 5 }}></div>
            </a>
        </div>
        <div>
            <a href="https://davincigraph.io" target="_blank" rel="noreferrer" className='underline'>Davincigraph.io</a> created this project as a ReactJS version of an example project written in Angular that demonstrates how to interact with the Hashpack wallet developed by <a href="https://github.com/Hashpack/hashconnect/tree/main/example/dapp" target="_blank" rel="noreferrer" className='underline'>Hashconnect.</a>
        </div>
    </section>
}