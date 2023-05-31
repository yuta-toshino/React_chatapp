import React from "react";

//Appコンポーネントの定義
class App extends React.Component {
  //コンストラクタ
  //stateの初期化
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      text: "",
    };
  }

  //入力完了イベント
  handleChange = (event) => {
    //入力値を設定
    this.setState({ text: event.target.value });
  };

  //ボタン押下イベント
  handleSubmit = (event) => {
    event.preventDefault();

    //入力値を送信
    const comment = {
      text: this.state.text,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(comment),
    };
    fetch("/api/comments", options);

    //入力値を空に設定
    this.setState({ text: "" });
  };

  //DOM描画後処理
  //初期化処理
  componentDidMount() {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "init") {
        this.setState({ comments: data.comments });
      } else if (data.type === "comments") {
        const comments = this.state.comments.concat(data.comments);
        this.setState({ comments });
      }
    };
  }

  //描画要素の定義
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="input"
            value={this.state.text}
            onChange={this.handleChange}
          />
          <input type="submit" value="Send" />
        </form>
        <ul>
          {this.state.comments.map((c, i) => (
            <li key={i}>{c.text}</li>
          ))}
        </ul>
        <p>テストコード追加しました。</p>
        <p>メールアドレスを変更しました。</p>
      </div>
    );
  }
}

export default App;
