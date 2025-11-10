import { useAuth } from "./hooks/useAuth";
import { LoginScreen } from "./components/Auth/LoginScreen";
import { EditorLayout } from "./components/Editor/EditorLayout";
import "./App.css";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1e1e1e',
        color: '#cccccc'
      }}>
        <p>Carregando Flutter IDE...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <EditorLayout />;
}

export default App;
