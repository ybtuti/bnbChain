import ActionIcon from "./ActionIcon";

function player({name = "player", action = "rock"}) {
    return (
        <div className="player">
            <div className="score">{`${name}:`}</div>
            <div className="action">
                {action !== "" ? <ActionIcon action={action} size={60} /> : 
                "Loading..."}
            </div>
        </div>
    );

}
export default player;