import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [echoResponse, setEchoResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // APIのベースURL
  // ローカル開発環境用
  //const API_BASE_URL = 'http://localhost:8000';
  // 本番環境用
  const API_BASE_URL = 'https://nakahara_basket_site_be.onrender.com';

  // ヘルスチェック
  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('ヘルスチェックエラー:', error);
      setHealthStatus({ status: 'error', message: 'バックエンドに接続できません' });
    } finally {
      setLoading(false);
    }
  };

  // ユーザーデータ取得
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // メッセージ送信
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();
      setEchoResponse(data);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      setEchoResponse({ error: 'メッセージ送信に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にヘルスチェック実行
  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>フロントエンド・バックエンド疎通確認</h1>
        
        {/* ヘルスチェック */}
        <div className="section">
          <h2>ヘルスチェック</h2>
          <button onClick={checkHealth} disabled={loading}>
            {loading ? '確認中...' : 'ヘルスチェック実行'}
          </button>
          {healthStatus && (
            <div className={`status ${healthStatus.status}`}>
              <p>ステータス: {healthStatus.status}</p>
              <p>{healthStatus.message}</p>
            </div>
          )}
        </div>

        {/* ユーザーデータ取得 */}
        <div className="section">
          <h2>ユーザーデータ取得（GET）</h2>
          <button onClick={fetchUsers} disabled={loading}>
            {loading ? '取得中...' : 'ユーザーデータ取得'}
          </button>
          {users.length > 0 && (
            <div className="users-list">
              <h3>取得したユーザー:</h3>
              <ul>
                {users.map(user => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* メッセージ送信 */}
        <div className="section">
          <h2>メッセージ送信（POST）</h2>
          <div className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力してください"
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !message.trim()}>
              {loading ? '送信中...' : 'メッセージ送信'}
            </button>
          </div>
          {echoResponse && (
            <div className="echo-response">
              <h3>サーバーからの応答:</h3>
              {echoResponse.error ? (
                <p className="error">{echoResponse.error}</p>
              ) : (
                <div>
                  <p><strong>受信メッセージ:</strong> {echoResponse.received_message}</p>
                  <p><strong>応答:</strong> {echoResponse.response}</p>
                  <p><strong>タイムスタンプ:</strong> {echoResponse.timestamp}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;