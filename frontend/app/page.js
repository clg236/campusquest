'use client';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { Select, Loader, Modal, Text, Image, Table, Stack, Textarea, Container, Center, Title, Button } from '@mantine/core';
import { Wand } from 'tabler-icons-react';

const homeGIFs = ['/dog_1.gif', 'magic_1.gif'];
const successGIFs = ['/magic_1.gif'];
const errorGIFs = ['/error_2.gif'];

function getRandomGif(gifArray) {
  const randomIndex = Math.floor(Math.random() * gifArray.length);
  return gifArray[randomIndex];
}

export default function Home() {
  const [ sql, setSql ] = useState('');
  const [ queryResults, setQueryResults ] = useState(null);
  const [ opened, { open, close }] = useDisclosure(false);
  const [ hint, setHint ] = useState('');
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ currentGif, setCurrentGif ] = useState(getRandomGif(homeGIFs));
  const [ db, setDB ] = useState('yelp')


  // super duper basic, just getting something easy done here
  const handleExecuteSQL = async () => {
    try {
      setLoading(true)
      // we can't access the DB from off campus, so have to run this locally...
      const response = await fetch('http://127.0.0.1:5000/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, db: db })
      });
      
      if (!response.ok) throw new Error('Failed to execute SQL');
      
      const data = await response.json();
      setQueryResults(data);
      setLoading(false)
      setCurrentGif(getRandomGif(successGIFs));

    } catch (error) {
      console.error(error);
      setQueryResults(null); 
      setLoading(false)
      setCurrentGif(getRandomGif(errorGIFs));
    }
  };

  const handleCloseErrorModal = () => {
    setHint('')
    setError('')
    setQueryResults(null)
    close()
  }

  function DynamicTable({ data }) {
    if (data && data.error) {
      setError(data.error)
      setHint(data.hint)
      setCurrentGif(getRandomGif(errorGIFs));
      open()

      // add funny error GIF
      return (
        <Container padding="lg">
          <Modal title='Small Problem!' opened={opened} onClose={handleCloseErrorModal} size='md'>
            <Image mt={30} src={currentGif} style={{ borderRadius: '15px'}} width={250} height={250} />
            <Title mt={30}>OPPSIE!</Title>
            <Title order={3}>The server responded with: </Title>
            <Text>{error}</Text>
            <Title order={3}>Here is a hint to help you: </Title>
            <Text>{hint}</Text>
          </Modal>
        </Container>
      );
    }
    // const columns = data && data.length > 0 ? Object.keys(data['rows'][0]) : [];
    const columns = Array.from({ length: data['columns'].length }, (_, index) => index);

    // console.log(data['columns']);
    // console.log(columns); // need to return actual column names
    // console.log(Object.keys(data['rows'][0]));
    return (
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {data['columns'].map((col, index) => (
              <Table.Th key={index}>{col}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data['rows'].map((row, rowIndex) => (
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
        <Title style={{ fontSize: 40 }} ta='center'>QUERY QUEST</Title>
        <Center>
          <Image mt={30} src={currentGif} style={{ borderRadius: '15px'}} width={500}/>
        </Center>
        <Select 
        label="Choose a Database"
          style={{ width: 300, fontSize: 20 }}
          data={['yelp', 'campus_quest']}
          value='YELP'
          onChange={setDB}
          placeholder='SELECT'
          searchable={false}
          clearable={false}
        />
        <Textarea
          style={{ fontSize: 20 }}
          label='Your SQL'
          description='type your spell here'
          value={sql}
          onChange={(event) => setSql(event.currentTarget.value)}
        />
        <Button variant='big-button' rightSection={loading ? <Loader /> : <Wand />} onClick={handleExecuteSQL} />
        {queryResults && <DynamicTable data={queryResults} />}
      </Stack>
    </Container>
  );
}