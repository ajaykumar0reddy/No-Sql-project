import { read } from '../../../lib/neo4j';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const view = url.searchParams.get('view');
    
    let cypher = '';
    
    if (view === 'students-by-faculty') {
      cypher = `
        MATCH (f:Faculty)-[:GUIDES]->(s:Student)
        RETURN f.name as faculty, s.name as student, s.program as program
      `;
    } else if (view === 'faculty-expertise') {
      cypher = `
        MATCH (f:Faculty)-[:EXPERT_IN]->(r:ResearchArea)
        RETURN f.name as faculty, r.name as area
      `;
    } else if (view === 'projects-area') {
      cypher = `
        MATCH (p:Project)-[:BELONGS_TO]->(r:ResearchArea)
        RETURN p.projectId as id, p.title as project, p.status as status, r.name as area
      `;
    } else if (view === 'all-projects') {
      cypher = `
        MATCH (p:Project)
        RETURN p.projectId as id, p.title as project, p.status as status
      `;

    } else if (view === 'student-projects') {
      cypher = `
        MATCH (s:Student)-[:WORKS_ON]->(p:Project)
        RETURN s.name as student, p.title as project
      `;
    } else {
      return NextResponse.json({ error: 'Invalid view type' }, { status: 400 });
    }

    const data = await read(cypher);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
