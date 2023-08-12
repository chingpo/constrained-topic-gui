
import '../css/logout.css';

const Thanks = ({error}) => {
    
    // auth不存在
    // api err jump here ?
    localStorage.removeItem('round');
    localStorage.removeItem('displayVisited');
    return (
        <div className="thanks-container">
            {error ? 
                <p className="thanks-text">
                    {error}
                    ご協力ありがとうございました。
                </p>
            :
                <p className="thanks-text">
                    タスクは以上になります。
                    ご協力ありがとうございました。
                </p>
            }
        </div>
    )
}

export default Thanks