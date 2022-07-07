import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="border-b-4 py-4 mb-5 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl"> Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false}/>
            </div>
        </nav>
    )
}

// p-5 border-b-2 flex flex-row