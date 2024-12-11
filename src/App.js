

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchPage = () => {
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${input}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };


    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

  return (
      <div className="text-center p-5">
        <h1 className="mb-3">GitHub User Search</h1>
          <div className="d-flex align-items-center justify-content-center">
              <input
                  className="form-control form-control-lg me-2"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter GitHub username"
                  style={{width: '300px' }}
                  onKeyUp={handleKeyUp}
              />
              <button className="btn btn-primary custom-btn-primary" onClick={handleSearch} style={{ padding: '10px 20px' }}>Search</button>
          </div>

        {user && (
            <div
                className="custom-card"
                onClick={() => navigate(`/details/${user.login}`)}
            >
                <div  className="d-flex mb-2">
                    <div className="col-sm-3">
                        <img className="rounded-circle" src={user.avatar_url} alt={user.login} style={{ width: '75px'}} />
                    </div>
                    <div className="col-sm-9">
                        <h2>{user.name || user.login}</h2>
                        <div className="d-flex mb-2">
                            <div className="d-flex text-muted">Following:<strong className="ms-2">{user.following || 'No update...'}</strong></div>
                            <div className="d-flex text-muted ms-2">Followers:<strong className="ms-2">{user.followers || 'No update...'}</strong></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="d-flex mb-2 text-muted">Url:<a className="ms-2" href={user.url}>{user.url || 'No update...'}</a></div>
                </div>
            </div>
        )}
      </div>
  );
};

const DetailsPage = () => {
  const { username } = useParams();
  const [repos, setRepos] = useState([]);

  React.useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        setRepos(response.data);
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    };

    fetchRepos();
  }, [username]);

  return (
      <div className="text-center p-5">
        <h1>{username}'s Repositories</h1>
        <Link to="/" className="custom-back-link">
          Back to Search
        </Link>
          <table className="table table-bordered custom-table">
              <thead className="table-light">
              <tr>
                  <th scope="col">Repository Name</th>
                  <th scope="col">Link</th>
              </tr>
              </thead>
              <tbody>
              {repos.length > 0 ? (
                  repos.map((repo) => (
                      <tr key={repo.id}>
                          <td className="text-start">{repo.name}</td>
                          <td className="text-start">
                              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                  {repo.html_url}
                              </a>
                          </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan="2" className="no-data">No repositories found</td>
                  </tr>
              )}
              </tbody>
          </table>
      </div>
  );
};

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/details/:username" element={<DetailsPage />} />
        </Routes>
      </Router>
  );
};

export default App;
