import os

file_path = r'c:\Users\Shyam\Website Test\src\app\admin\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

correct_function = """    const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const reviewData = {
            paperId: selectedPaper.id,
            reviewerName: formData.get('reviewerName'),
            score: parseInt(formData.get('score') as string),
            comments: formData.get('comments')
        };

        setReviewLoading(true);
        try {
            const res = await fetch('/api/paper/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            if (res.ok) {
                fetchReviews(selectedPaper.id);
                (e.target as HTMLFormElement).reset();
            } else {
                const err = await res.json();
                alert('Failed to submit review: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(\"Failed to submit review\", e);
        } finally {
            setReviewLoading(false);
        }
    };\n\n"""

# Find the start of handleLogout
token = '    const handleLogout = async () => {'
if token in content:
    # Remove any existing handleSubmitReview if it was incorrectly added
    import re
    content = re.sub(r'    const handleSubmitReview = async \(.*?\) => \{.*?    \};\n\n', '', content, flags=re.DOTALL)
    
    # Re-verify token is still there
    if token in content:
        new_content = content.replace(token, correct_function + token)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success")
    else:
        print("Token lost after regex")
else:
    print("Token not found")
