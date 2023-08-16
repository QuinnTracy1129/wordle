import React, { useEffect, useState } from "react";
import "./App.css";
import Swal from "sweetalert2";

const Box = ({ color, className, onClick, size = 4 }) => {
  return (
    <span
      title={color && color.toUpperCase()}
      onClick={() => onClick && onClick(color)}
      className={`fa fa-square text-${
        color || "secondary"
      } fa-${size}x mx-1 ${className}`}
    />
  );
};

const pallete = [
  ["blue", "green", "red", "yellow", "cyan", "black"],
  ["indigo", "maroon", "coral", "lavander", "olive", "crimson"],
  ["apricot", "slate", "ruby", "mocha", "teal", "pearl"],
  ["orchid", "amber", "azure", "topaz", "raven", "blush"],
];

export default function App() {
  const [guesses, setGuesses] = useState([]),
    [colors, setColors] = useState([...pallete.slice(0, 2)]),
    [combination, setCombination] = useState([]),
    [guess, setGuess] = useState(new Array(5).fill(null)),
    [didWin, setDidWin] = useState(false),
    [difficulty, setDifficulty] = useState("EASY"),
    [difficulties, setDifficulties] = useState({
      EASY: {
        moves: 9,
        colors: 12,
        wins: 0,
        loss: 0,
      },
      MEDIUM: {
        moves: 8,
        colors: 18,
        wins: 0,
        loss: 0,
      },
      HARD: {
        moves: 7,
        colors: 24,
        wins: 0,
        loss: 0,
      },
    });

  const generateCombination = () => {
    var combination = [];

    var cover = 2;

    if (difficulty === "MEDIUM") cover = 3;

    if (difficulty === "HARD") cover = 4;

    const _colors = [].concat(...pallete.slice(0, cover));

    for (let index = 0; index < 5; index++) {
      combination[index] =
        _colors[Math.floor(Math.random() * _colors.length - 1) + 1];
    }

    setCombination(combination);
  };

  useEffect(generateCombination, [colors, difficulty]);

  useEffect(() => {
    if (didWin) {
      Swal.fire({
        icon: "success",
        title: "You win!",
        text: `You completed it in ${guesses.length} move(s)!`,
        confirmButtonText: "Restart",
        footer: "You can adjust the difficulties for more challenge.",
      }).then(() => {
        const _difficulties = { ...difficulties };
        _difficulties[difficulty].wins += 1;
        setDifficulties(_difficulties);
        handleGameClear();
      });
    }
  }, [didWin, guesses, difficulties, difficulty]);

  const handleClick = color => {
    const _guess = [...guess];

    const index = _guess.findIndex(_ => _ === null);

    _guess[index > -1 ? index : 4] = color;

    setGuess(_guess);
  };

  const handleSubmit = () => {
    const index = guess.findIndex(_ => _ === null);

    if (index > -1) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Combination!",
        text: "Must have 5 colors.",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      var validation = {
        guess,
        details: [],
      };

      for (const index in guess) {
        const _guess = guess[index];

        const isIncluded = combination
          .map((_, index) => {
            if (_ === _guess) return index;

            return null;
          })
          .filter(_ => _ !== null);

        if (isIncluded.length > 0) {
          const isCorrect = isIncluded.some(_ => _ === Number(index));

          if (isCorrect) {
            validation.details[index] = "correct";
          } else {
            validation.details[index] = "misplaced";
          }
        } else {
          validation.details[index] = "wrong";
        }
      }

      if (validation.details?.filter(_ => _ === "correct").length === 5)
        setDidWin(true);

      const _guesses = [...guesses];

      _guesses.push(validation);

      setGuesses(_guesses);

      if (_guesses.length === difficulties[difficulty].moves) handleGameLoss();

      handleClear();
    }
  };

  const handleClear = () => setGuess(new Array(5).fill(null));

  const handleRemove = () => {
    const _guess = [...guess];

    const index = _guess.findIndex(_ => _ === null);

    if (index !== 0) {
      _guess[index > -1 ? (index > 0 ? index - 1 : index) : 4] = null;

      setGuess(_guess);
    }
  };

  const handleGameLoss = () =>
    Swal.fire({
      icon: "error",
      title: "You lost!",
      text: `You've used up all your moves!`,
      html: `<div><div>${combination
        .map(_ => `<span class='fa fa-square text-${_}' title='${_}' />`)
        .join(" ")}</div><div>${combination.join(", ")}</div></div>`,
      confirmButtonText: "Restart",
    }).then(() => {
      const _difficulties = { ...difficulties };
      _difficulties[difficulty].loss += 1;
      setDifficulties(_difficulties);
      handleGameClear();
    });

  const handleGameClear = () => {
    handleClear();
    setGuesses([]);
    generateCombination();
    setDidWin(false);
  };

  const handleDifficultyTable = key => difficulties[difficulty][key];

  return (
    <div style={{ height: "100vh" }} className="container-fluid">
      <div className="row h-100">
        <div className="col-6 border-end pt-5">
          <div
            onClick={() => console.log(combination)}
            className="d-flex justify-content-center mb-5"
          >
            {guess.map((box, index) => (
              <Box color={box} key={`guess-${index}`} />
            ))}
          </div>
          <div style={{ minHeight: "260px" }}>
            {colors.map((cluster, index) => (
              <div
                key={`cluster-${index}`}
                className="d-flex justify-content-center"
              >
                {cluster.map((box, index) => (
                  <Box
                    onClick={handleClick}
                    color={box}
                    key={`colors-${index}`}
                    className={"cursor-pointer"}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="btn-group w-100 px-5 mt-3">
            <button onClick={handleClear} className="btn btn-danger">
              CLEAR
            </button>
            <button onClick={handleRemove} className="btn btn-warning">
              REMOVE
            </button>
            <button onClick={handleSubmit} className="btn btn-success">
              SUBMIT
            </button>
          </div>

          <div className="px-5">
            <table className="table text-center table-bordered my-3">
              <thead>
                <tr>
                  <th>Moves</th>
                  <th>Colors</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{handleDifficultyTable("moves")}</td>
                  <td>{handleDifficultyTable("colors")}</td>
                </tr>
                <tr>
                  <td>Wins: {handleDifficultyTable("wins")}</td>
                  <td>Lose: {handleDifficultyTable("loss")}</td>
                </tr>
              </tbody>
            </table>
            <div className="btn-group w-100">
              {["EASY", "MEDIUM", "HARD"].map((_difficulty, index) => (
                <button
                  key={`difficulty-${index}`}
                  onClick={() => {
                    const handleProceed = () => {
                      setColors([...pallete.slice(0, index + 2)]);
                      setDifficulty(_difficulty);
                      handleGameClear();
                    };

                    if (guesses.length > 0) {
                      Swal.fire({
                        icon: "question",
                        title: "Switch difficulties?",
                        text: "Your current progress will be lost.",
                        confirmButtonText: "Proceed",
                        showCancelButton: true,
                        footer: "Previous Completed Progress are unaffected.",
                      }).then(res => {
                        if (res.isConfirmed) {
                          handleProceed();
                        }
                      });
                    } else {
                      handleProceed();
                    }
                  }}
                  className={`btn btn${
                    difficulty !== _difficulty ? "-outline" : ""
                  }-info`}
                >
                  {_difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-6 pt-5">
          {guesses?.map(({ guess, details }, index) => (
            <div
              className="row border-top border-bottom py-2"
              key={`guesses-${index}`}
            >
              <div className="col-1 d-flex align-items-center">
                <h5 className="mb-0 mx-auto">{index + 1}.</h5>
              </div>
              <div className="col-7 d-flex">
                <div className="mx-auto">
                  {guess?.map((color, index) => (
                    <Box size={3} color={color} key={`guessesGuess-${index}`} />
                  ))}
                </div>
              </div>
              <div className="col-4 d-flex align-items-center">
                {details.map((detail, index) => {
                  var color = "danger",
                    title = "Wrong Color";

                  if (detail === "correct") {
                    title = "Correct Color";
                    color = "success";
                  }

                  if (detail === "misplaced") {
                    title = "Wrong Position";
                    color = "info";
                  }

                  return (
                    <div
                      key={`guessesDetails-${index}`}
                      title={title}
                      className="cursor-pointer mx-1"
                    >
                      <span className={`fa fa-square text-${color}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {guesses.length < difficulties[difficulty].moves && (
            <div className="row border-top border-bottom py-2">
              <div className="col-7 offset-1 d-flex">
                <div className="mx-auto">
                  {new Array(5).fill(null).map((_, index) => (
                    <Box key={`preset-${index}`} size={3} />
                  ))}
                </div>
              </div>

              <div className="col-4 d-flex align-items-center">
                {new Array(5).fill(null).map((_, index) => (
                  <div
                    key={`presetOptions-${index}`}
                    title="Wrong Color"
                    className="cursor-pointer mx-1"
                  >
                    <span className="fa fa-square text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
