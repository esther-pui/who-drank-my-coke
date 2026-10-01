from typing import TypedDict # describe what our graph's state
from langgraph.graph import StateGraph, END # object we'll use to build our graph

# State → what information moves through the graph
# Node → something that does work
# Edge → tells LangGraph where to go next
# START → where execution begins
# END → where execution finishes

class GameState(TypedDict):
    game_id: str
    action: str
    character: str
    object: str
    discovered_clues: list[str]
    accusation_result: str


graph_builder = StateGraph(GameState)

def test_node(state: GameState):
    print("Node received", state)

    return state

def talk_node(state: GameState):
    print("Talk node received", state)

    return state

def investigate_node(state: GameState):
    print("Investigate node received", state)

    if state["object"] == "fridge":
        print("You found a clue near the fridge!")
        if "fridge_opened" not in state["discovered_clues"]:
            state["discovered_clues"].append("fridge_opened")

    elif state["object"] == "floor":
        print("You found something on the floor!")
        if "cat_paw_prints" not in state["discovered_clues"]:
            state["discovered_clues"].append("cat_paw_prints")

    elif state["object"] == "counter":
        print("You found an empty Coke can!")
        
        if "empty_coke_can" not in state["discovered_clues"]:
            state["discovered_clues"].append("empty_coke_can")

    return state

def accuse_node(state: GameState):
    print("Accuse node received", state)

    if state["character"] == "cat":
        print("Correct! The cat drank the Coke.")
        state["accusation_result"] = "correct"
    else:
        print("Wrong! That character did not drink the Coke.")
        state["accusation_result"] = "wrong"

    return state

def route_action(state: GameState):
    if state["action"] == "talk":
        return "talk"
    if state["action"] == "investigate":
        return "investigate"
    if state["action"] == "accuse":
        return "accuse"
    return "unknown"

# create node called test and run test_node
graph_builder.add_node("test", test_node)
graph_builder.add_node("talk", talk_node)
graph_builder.add_node("investigate", investigate_node)
graph_builder.add_node("accuse", accuse_node)


# when graph start, start test node
graph_builder.set_entry_point("test")

# After test, call route_action.
# If it returns "talk", go to second.
# If it returns "investigate", go to END
graph_builder.add_conditional_edges(
    "test",
    route_action,
    {
        "talk": "talk",
        "investigate": "investigate",
        "accuse": "accuse"
    }
)
graph_builder.add_edge("investigate", END)
graph_builder.add_edge("talk", END)
graph_builder.add_edge("accuse", END)
graph = graph_builder.compile()

result = graph.invoke({
    "game_id": "test-game",
    "action": "accuse",
    "character": "witch",
    "object": "",
    "discovered_clues": []
})

print("Final result:", result)