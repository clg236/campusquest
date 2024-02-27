'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Table, Stack, Textarea, Image, BackgroundImage, AspectRatio, Container, Center, Title, TextInput, Button } from '@mantine/core';
import { Wand } from 'tabler-icons-react';

export default function Home() {
  const [sql, setSql] = useState('');
  const [queryResults, setQueryResults] = useState(null);

  // super duper basic, just getting something easy done here
  const handleExecuteSQL = async () => {
    try {
      // we can't access the DB from off campus, so have to run this locally...
      const response = await fetch('http://127.0.0.1:5000/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });
      if (!response.ok) throw new Error('Failed to execute SQL');
      const data = await response.json();
      setQueryResults(data);
    } catch (error) {
      console.error(error);
      setQueryResults(null); 
    }
  };

  function DynamicTable({ data }) {
    const columns = data && data.length > 0 ? Object.keys(data[0]) : []; 
    return (
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col, index) => (
              <Table.Th key={index}>{col}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row, rowIndex) => (
            <Table.Tr key={rowIndex}>
              {columns.map((col, cellIndex) => (
                <Table.Td key={cellIndex}>{row[col]}</Table.Td> 
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  }

  return (
    <Container
      padding="lg"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}
    >
      <Stack>
        <Title ta='center'>CAMPUS QUEST</Title>
        <Center>
          <video style={{ borderRadius: '15px'}} autoPlay loop muted>
            <source src={"/quest.mp4"} type="video/mp4" />
          </video>
        </Center>

        <Textarea
          style={{ fontSize: 20 }}
          label='Your SQL'
          description='type your spell here'
          value={sql}
          onChange={(event) => setSql(event.currentTarget.value)}
        />
        <Button variant='big-button' rightSection={<Wand />} onClick={handleExecuteSQL} />
        {queryResults && <DynamicTable data={queryResults} />}
      </Stack>
    </Container>
  );
}