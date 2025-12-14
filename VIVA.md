# VIVA Questions & Explanations

## Use Case: Why Graph Database (Neo4j)?
1. **Highly Connected Data**: Our system treats relationships (GUIDES, EXPERT_IN) as first-class citizens, unlike key-value stores or document DBs.
2. **Flexible Schema**: We can easily add new node types (e.g., "Publication") or relationships without altering a rigid table structure.
3. **Performance**: Traversing relationships in a graph (e.g., "Find all projects under a faculty's expertise") is O(1) or O(k), whereas in SQL it requires expensive JOIN operations.
4. **Natural Modeling**: The "Faculty guides Student" relationship model matches the real world perfectly.

## Code Explanation
- **`lib/neo4j.js`**:
  - Implements a **Singleton Pattern** for the Neo4j Driver to avoid opening too many connections.
  - Provides helper functions `read()` and `write()` for cleaner API code.
- **REST APIs**:
  - We used Next.js API Routes to create a simple backend.
  - `POST /api/nodes`: Dynamic creation of different node types using Cypher parameters.
  - `POST /api/relationships`: Uses `MERGE` to create relationships, ensuring we don't create duplicates.

## Cypher Keywords
- **MATCH**: Like `SELECT` in SQL, finds patterns.
- **CREATE**: Creates new nodes/relationships.
- **MERGE**: "Create if not exists".
- **RETURN**: Defines what data to send back.

## Neo-brutalism Design
- Chosen for its high contrast and distinct visibility.
- Uses strict borders and flat colors to make the UI "pop" and functionality clear.
