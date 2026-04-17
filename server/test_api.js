async function testStart() {
    try {
        const res = await fetch('http://localhost:5000/api/v1/interviews/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                domain: 'Full Stack Development',
                difficulty: 'medium',
                mode: 'mix'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testStart();
