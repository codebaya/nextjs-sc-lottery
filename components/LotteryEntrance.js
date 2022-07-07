// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis";
import {abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import { useNotification } from "web3uikit";
// import {async} from "@babel/runtime/helpers/regeneratorRuntime";

export default function LotteryEntrance() {

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    // console.log("chainId", parseInt(chainId))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState(0);
    const [numPlayers, setNumPlayers] = useState(0);
    const [recentWinner, setRecentWinner] = useState(0);

    const dispatch = useNotification()

    const {runContractFunction: enterRaffle, isFetching, isLoading} = useWeb3Contract({
        abi: abi, //,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi, //,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi, //,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi, //,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function getFee() {
        const entranceFee = (await getEntranceFee()).toString();
        const numPlayers = (await getNumberOfPlayers()).toString();
        const recentWinner = (await getRecentWinner()).toString();
        setEntranceFee(entranceFee)
        setNumPlayers(numPlayers)
        setRecentWinner(recentWinner)
        console.log("some : ", entranceFee)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            getFee()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        getFee()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell"
        })
    }

    return (
        <div>
            {/*Hi lottery enterance*/}
            { raffleAddress ? (
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async () => {
                        await enterRaffle({
                            onSuccess: handleSuccess, // onComplete, onError
                            onError: (error) => console.log(error)
                        })
                    }}
                            disabled={isLoading || isFetching}
                    >{isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Enter Raffle"
                    )}</button>
                    <p>EntranceFee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                    <p>Number of Players : {numPlayers}</p>
                    <p>Recent Winner : {recentWinner}</p>

                </div>
            ) : (
                <div>No Raffle Founded!</div>
            ) }


        </div>
    )
}