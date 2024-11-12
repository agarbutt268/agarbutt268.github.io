class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      equation: "0",
      result: false,
      decimalActive: false,
    };

    this.calculate = this.calculate.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.operatorSelect = this.operatorSelect.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.enter = this.enter.bind(this);
    this.clear = this.clear.bind(this);
  }

  calculate() {
    var expression = this.state.equation.replace(/[/\*\+\-]+([/\*\+])/g, "$1");
    console.log(expression);
    return eval(expression);
  }

  keyPress(e) {
    this.setState((state) => {
      if (/[/\*\+\-]0$/.test(state.equation) || state.equation == "0") {
        return { equation: state.equation.slice(0, -1) + e.target.value };
      } else {
        return {
          equation: (state.result ? "" : state.equation) + e.target.value,
        };
      }
    });

    this.setState({ result: false });
  }

  handleDecimal(e) {
    this.setState((state) => ({
      equation: state.decimalActive
        ? state.equation
        : state.equation + e.target.value,
      decimalActive: true,
    }));
  }

  operatorSelect(e) {
    // if there is a value in input move it to the equation along with the operator
    // un-highlight all other operators
    // highlight selected operator
    this.setState((state) => ({
      equation: state.equation + e.target.value,
      decimalActive: false,
      result: false,
    }));
  }

  enter() {
    this.setState({
      equation: this.calculate(),
      decimalActive: false,
      result: true,
    });
  }

  clear() {
    this.setState({
      equation: "0",
      decimalActive: false,
    });
  }

  render() {
    return (
      <div id="calculator" className="container">
        <div id="display" className="micro-5-charted-regular overflow-auto">
          {this.state.equation}
        </div>

        <div className="container">
          <div className="row">
            <button
              id="seven"
              class="col-3 number"
              value="7"
              onClick={this.keyPress}
            >
              7
            </button>
            <button
              id="eight"
              class="col-3 number"
              value="8"
              onClick={this.keyPress}
            >
              8
            </button>
            <button
              id="nine"
              class="col-3 number"
              value="9"
              onClick={this.keyPress}
            >
              9
            </button>
            <button
              id="add"
              class="col-3 operator"
              value="+"
              onClick={this.operatorSelect}
            >
              +
            </button>
          </div>
          <div className="row">
            <button
              id="four"
              class="col-3 number"
              value="4"
              onClick={this.keyPress}
            >
              4
            </button>
            <button
              id="five"
              class="col-3 number"
              value="5"
              onClick={this.keyPress}
            >
              5
            </button>
            <button
              id="six"
              class="col-3 number"
              value="6"
              onClick={this.keyPress}
            >
              6
            </button>
            <button
              id="subtract"
              class="col-3 operator"
              value="-"
              onClick={this.operatorSelect}
            >
              -
            </button>
          </div>
          <div className="row">
            <button
              id="one"
              class="col-3 number"
              value="1"
              onClick={this.keyPress}
            >
              1
            </button>
            <button
              id="two"
              class="col-3 number"
              value="2"
              onClick={this.keyPress}
            >
              2
            </button>
            <button
              id="three"
              class="col-3 number"
              value="3"
              onClick={this.keyPress}
            >
              3
            </button>
            <button
              id="divide"
              class="col-3 operator"
              value="/"
              onClick={this.operatorSelect}
            >
              /
            </button>
          </div>
          <div className="row">
            <button
              id="zero"
              class="col-6 number"
              value="0"
              onClick={this.keyPress}
            >
              0
            </button>
            <button
              id="decimal"
              class="col-3 number"
              value="."
              onClick={this.handleDecimal}
            >
              .
            </button>
            <button
              id="multiply"
              class="col-3 operator"
              value="*"
              onClick={this.operatorSelect}
            >
              x
            </button>
          </div>
          <div class="row">
            <button id="clear" class="col-6 " onClick={this.clear}>
              AC
            </button>
            <button id="equals" class="col-6 " onClick={this.enter}>
              =
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("calc"));
