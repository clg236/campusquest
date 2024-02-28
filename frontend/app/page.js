'use client';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { TextInput, Select, Loader, Modal, Text, Image, Table, Stack, Textarea, Container, Center, Title, Button } from '@mantine/core';
import { Wand } from 'tabler-icons-react';

const homeGIFs = ['/dog_1.gif', 'magic_1.gif', '/spell_1.gif', '/spell_2.gif'];
const successGIFs = ['/magic_1.gif', '/win_1.gif', '/win_2.gif'];
const errorGIFs = ['/error_1.gif','/error_2.gif', '/error_3.gif'];

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
  const [ name, setName ] = useState('')


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
        body: JSON.stringify({ sql, db: db, name: name })
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
    // console.log(Object.keys(data['rows']).length);
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

    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return `${text.substring(0, maxLength)}...`;
      }
      return text;
    };

    return (
      <Table.ScrollContainer>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {data['columns'].map((col, index) => (
              <Table.Th style={{ whiteSpace: 'normal' }} key={index}><Text maw={200} truncate="end">{col}</Text></Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data['rows'].map((row, rowIndex) => (
            <Table.Tr key={rowIndex}>
              {columns.map((col, cellIndex) => (
                <Table.Td key={cellIndex}><Text truncate="end">{row[col]}</Text></Table.Td> 
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      </Table.ScrollContainer>
    );
  }

  return (
    <>
    <Container
      padding="xs"
      mb={30}
      >
        <Title style={{ fontSize: 40 }} ta='center'>QUERY QUEST</Title>
        <Center>
          <Image mt={30} src={currentGif} style={{ borderRadius: '15px'}} w={200}/>
        </Center>
        <TextInput
          miw={400}
          style={{ fontSize: 20 }}
          label='Your Name'
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
      <Stack>
        <Select 
        miw={400}
        label="Choose a Database"
          style={{ width: 300, fontSize: 20 }}
          data={['yelp', 'campus_quest']}
          value={db}
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
        <Button variant='big-button' rightSection={loading ? <Loader color='white' /> : <Wand />} onClick={handleExecuteSQL} />
      </Stack>
      
    </Container>
    {queryResults && <DynamicTable data={queryResults} />}
    </>
  );
}