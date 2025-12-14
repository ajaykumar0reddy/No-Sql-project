import { write } from '../../../lib/neo4j';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { fromId, toId, type } = await request.json();

    let cypher = '';
    // Relationships:
    // (Faculty)-[:GUIDES]->(Student)
    // (Faculty)-[:EXPERT_IN]->(ResearchArea)
    // (Student)-[:WORKS_ON]->(Project)
    // (Project)-[:BELONGS_TO]->(ResearchArea)

    if (type === 'GUIDES') {
      cypher = `
        MATCH (f:Faculty {facultyId: $fromId})
        MATCH (s:Student {studentId: $toId})
        MERGE (f)-[:GUIDES]->(s)
        RETURN f, s
      `;
    } else if (type === 'EXPERT_IN') {
      cypher = `
        MATCH (f:Faculty {facultyId: $fromId})
        MATCH (r:ResearchArea {areaId: $toId})
        MERGE (f)-[:EXPERT_IN]->(r)
        RETURN f, r
      `;
    } else if (type === 'WORKS_ON') {
      cypher = `
        MATCH (s:Student {studentId: $fromId})
        MATCH (p:Project {projectId: $toId})
        MERGE (s)-[:WORKS_ON]->(p)
        RETURN s, p
      `;
    } else if (type === 'BELONGS_TO') {
      cypher = `
        MATCH (p:Project {projectId: $fromId})
        MATCH (r:ResearchArea {areaId: $toId})
        MERGE (p)-[:BELONGS_TO]->(r)
        RETURN p, r
      `;
    } else {
      return NextResponse.json({ error: 'Invalid relationship type' }, { status: 400 });
    }

    await write(cypher, { fromId, toId });
    return NextResponse.json({ message: 'Relationship created' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
