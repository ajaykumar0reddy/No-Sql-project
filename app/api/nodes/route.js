import { write, read } from '../../../lib/neo4j';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let cypher = '';
    let result;

    if (type === 'faculty') {
      cypher = `
        CREATE (f:Faculty {
          facultyId: $id, 
          name: $name, 
          department: $department, 
          designation: $designation
        }) RETURN f
      `;
      result = await write(cypher, { 
        id: crypto.randomUUID(), 
        name: data.name, 
        department: data.department, 
        designation: data.designation 
      });
    } else if (type === 'student') {
      cypher = `
        CREATE (s:Student {
          studentId: $id, 
          name: $name, 
          program: $program
        }) RETURN s
      `;
      result = await write(cypher, { 
        id: crypto.randomUUID(), 
        name: data.name, 
        program: data.program 
      });
    } else if (type === 'research_area') {
      cypher = `
        CREATE (r:ResearchArea {
          areaId: $id, 
          name: $name
        }) RETURN r
      `;
      result = await write(cypher, { 
        id: crypto.randomUUID(), 
        name: data.name 
      });
    } else if (type === 'project') {
      cypher = `
        CREATE (p:Project {
          projectId: $id, 
          title: $title, 
          status: $status
        }) RETURN p
      `;
      result = await write(cypher, { 
        id: crypto.randomUUID(), 
        title: data.title, 
        status: data.status 
      });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Node created', result });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    let cypher = '';
    if (type === 'faculty') cypher = 'MATCH (n:Faculty) RETURN n';
    else if (type === 'student') cypher = 'MATCH (n:Student) RETURN n';
    else if (type === 'research_area') cypher = 'MATCH (n:ResearchArea) RETURN n';
    else if (type === 'project') cypher = 'MATCH (n:Project) RETURN n';
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const data = await read(cypher);
    const formattedData = data.map(row => row.n.properties);
    return NextResponse.json({ data: formattedData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'project') {
      const cypher = `
        MATCH (p:Project {projectId: $id})
        SET p.status = $status
        RETURN p
      `;
      const result = await write(cypher, { id, status: data.status });
      return NextResponse.json({ message: 'Project status updated', result });
    }

    return NextResponse.json({ error: 'Invalid type or not implemented' }, { status: 400 });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    if (type === 'project') {
      const cypher = `
        MATCH (p:Project {projectId: $id})
        DETACH DELETE p
      `;
      await write(cypher, { id });
      return NextResponse.json({ message: 'Project deleted' });
    }

    return NextResponse.json({ error: 'Invalid type or not implemented' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
