import lottery from "./lottery.js";
import "./App.css";
import web3 from "./web3.js";
import { useEffect, useRef, useState } from "react";

function App() {
  const kitna = useRef();
  const [message, setMessage] = useState("");

  const [manager, setManager] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  // web3.eth.requestAccounts().then(console.log);

  useEffect(() => {
    const as = async () => {
      setManager(await lottery.methods.manager().call());
      setPlayers(await lottery.methods.getPlayers().call());
      setBalance(await web3.eth.getBalance(lottery.options.address));
    };
    as();
  });

  const onEnter = async (e) => {
    e.preventDefault();

    const acc = await web3.eth.requestAccounts();
    setMessage("Requesting to Enter!");
    await lottery.methods.enter().send({
      value: web3.utils.toWei(kitna.current.value, "ether"),
      from: acc[0],
      gas: "1000000",
    });
    setMessage("Entered successfully!");
  };

  const pickWinner = async (e) => {
    e.preventDefault();

    const acc = await web3.eth.requestAccounts();
    setMessage("Picking winner!");
    await lottery.methods.pickWinner().send({
      from: acc[0],
      gas: "1000000",
    });
    setMessage("A winner has been picked!");
  };

  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} players competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <div>
        <h3>Want to try your luck?</h3>
        <form onSubmit={onEnter}>
          <label>Amount of ether to enter </label>

          <input ref={kitna}></input>
          <button formAction="submit"> Enter </button>
        </form>
      </div>

      <div>
        <h3> Ready to pick a winner? </h3>
        <button onClick={pickWinner}>Pick a winner!</button>
      </div>

      <h1>{message}</h1>
    </div>
  );
}

export default App;
