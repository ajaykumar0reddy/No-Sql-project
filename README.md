# Faculty Research Guidance Management System (Graph Based)

A simple full-stack application managing faculty-student-research relationships using Next.js and Neo4j.

## Tech Stack
- **Frontend**: Next.js (App Router), React
- **Styling**: Neo-brutalism (CSS Modules/Global CSS)
- **Backend**: Next.js API Routes
- **Database**: Neo4j (Graph Database)
- **Driver**: `neo4j-driver` (Official JavaScript Driver)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   - Create a `.env.local` file in the root directory.
   - Add your Neo4j credentials:
     ```env
     NEO4J_URI=neo4j+s://your-db-instance.databases.neo4j.io
     NEO4J_USER=neo4j
     NEO4J_PASSWORD=your-password
     ```
   - You can use a local Neo4j Desktop instance or [Neo4j AuraDB (Free Tier)](https://neo4j.com/cloud/aura/).

3. **Run the Application**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000)

## Graph Data Model & Cypher Queries

### Nodes
- **Faculty**: `(:Faculty {facultyId, name, department, designation})`
- **Student**: `(:Student {studentId, name, program})`
- **ResearchArea**: `(:ResearchArea {areaId, name})`
- **Project**: `(:Project {projectId, title, status})`

### Relationships
- `(:Faculty)-[:GUIDES]->(:Student)`
- `(:Faculty)-[:EXPERT_IN]->(:ResearchArea)`
- `(:Student)-[:WORKS_ON]->(:Project)`
- `(:Project)-[:BELONGS_TO]->(:ResearchArea)`

### Useful Cypher Queries

**View all relationships:**
```cypher
MATCH (n)-[r]->(m) RETURN n, r, m
```

**Find students guided by a specific faculty:**
```cypher
MATCH (f:Faculty {name: "Dr. Smith"})-[:GUIDES]->(s:Student) RETURN s.name
```

**Find projects in a specific area:**
```cypher
MATCH (p:Project)-[:BELONGS_TO]->(r:ResearchArea {name: "AI"}) RETURN p.title
```

**Delete all data (Reset):**
```cypher
MATCH (n) DETACH DELETE n
```
