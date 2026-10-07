/**
 * Curated presets for campus placement & corporate hiring testing
 */

const PRESETS = {
  fullstack_fresher: {
    jobTitle: 'Junior Full Stack Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Mixed',
    numQuestions: 10,
    difficultyMix: { easy: 40, medium: 50, hard: 10 },
    keySkills: 'JavaScript, React, Node.js, Express, MongoDB, REST APIs, Git',
    jobDescription: `Job Overview:
We are seeking an enthusiastic Junior Full Stack Developer to join our engineering team. As a campus recruit, you will contribute across the software development lifecycle, building responsive user interfaces and scalable backend microservices.

Responsibilities:
- Develop modern web components using React.js, HTML5, and CSS3.
- Build RESTful APIs and microservices using Node.js and Express.
- Collaborate with database architects on schema design in MongoDB / PostgreSQL.
- Write clean, maintainable, and well-tested code with Jest/Mocha.
- Participate in Agile ceremonies, code reviews, and Git-based collaborative workflows.

Requirements:
- Bachelor's degree in Computer Science, Information Technology, or related discipline.
- Sound understanding of JavaScript (ES6+), asynchronous programming, and event loops.
- Basic exposure to React state management and component life cycle.
- Familiarity with Git version control and building RESTful endpoints.
- Strong problem-solving aptitude, communication skills, and eagerness to learn.`
  },

  data_analyst: {
    jobTitle: 'Data Analyst',
    experienceLevel: 'Junior',
    interviewType: 'Mixed',
    numQuestions: 10,
    difficultyMix: { easy: 30, medium: 50, hard: 20 },
    keySkills: 'SQL, Python, Excel, Power BI, Data Cleaning, Statistical Analysis',
    jobDescription: `Job Overview:
We are looking for a Data Analyst to transform complex datasets into actionable business insights. You will partner with marketing, product, and leadership teams to build dashboards and uncover trends.

Responsibilities:
- Write optimized SQL queries to extract, transform, and aggregate data from relational warehouses.
- Perform exploratory data analysis and data cleansing using Python (Pandas, NumPy).
- Design and maintain executive dashboards in Power BI or Tableau.
- Automate routine reporting workflows and spreadsheets using advanced Excel (Pivot Tables, VLOOKUP, XLOOKUP).
- Present analytical findings to cross-functional stakeholders with clear business narratives.

Requirements:
- Proven experience with SQL querying (joins, window functions, aggregations).
- Working knowledge of Python for data manipulation and visualization.
- Hands-on dashboard creation in Power BI or Tableau.
- Strong numerical aptitude, analytical mindset, and communication skills.`
  },

  cloud_devops: {
    jobTitle: 'DevOps & Cloud Engineer',
    experienceLevel: 'Mid',
    interviewType: 'Technical',
    numQuestions: 10,
    difficultyMix: { easy: 20, medium: 50, hard: 30 },
    keySkills: 'Docker, Kubernetes, AWS, CI/CD, Terraform, Linux, Monitoring',
    jobDescription: `Job Overview:
We are looking for a Mid-Level DevOps Engineer to enhance our cloud infrastructure, automate deployment pipelines, and guarantee high platform availability.

Responsibilities:
- Containerize enterprise microservices using Docker and orchestrate them on Kubernetes (EKS).
- Build, automate, and optimize robust CI/CD pipelines using GitHub Actions / GitLab CI.
- Manage cloud infrastructure as code (IaC) utilizing Terraform on AWS (EC2, S3, RDS, VPC).
- Configure system observability and monitoring stacks with Prometheus, Grafana, and CloudWatch.
- Conduct incident management, root-cause analyses, and implement disaster recovery procedures.

Requirements:
- 2-4 years of experience working with Linux systems and AWS cloud services.
- Solid hands-on knowledge of container orchestration (Kubernetes) and Helm charts.
- Experience with infrastructure automation using Terraform or Ansible.
- Strong scripting skills in Bash or Python.`
  },

  ai_ml_engineer: {
    jobTitle: 'AI / Machine Learning Engineer',
    experienceLevel: 'Senior',
    interviewType: 'Mixed',
    numQuestions: 12,
    difficultyMix: { easy: 10, medium: 50, hard: 40 },
    keySkills: 'Python, PyTorch, Transformers, LLMs, Vector Databases, MLOps, Model Optimization',
    jobDescription: `Job Overview:
We are seeking an experienced Senior AI/ML Engineer to lead the design and deployment of Generative AI applications and production predictive pipelines.

Responsibilities:
- Architect and fine-tune large language models (LLMs) and retrieval-augmented generation (RAG) pipelines.
- Implement vector search architectures with Pinecone, Milvus, or Qdrant.
- Deploy low-latency inference services using Triton, vLLM, or FastAPI with Docker.
- Build continuous MLOps evaluation frameworks for model drift, hallucination detection, and latency tracking.
- Mentor junior data scientists and align technical roadmaps with product leadership.

Requirements:
- 4+ years of production experience in machine learning and deep learning.
- Strong proficiency in PyTorch/TensorFlow, Hugging Face transformers, and Python.
- Proven track record deploying models to production with robust observability.
- Deep theoretical foundation in linear algebra, statistics, and neural architectures.`
  }
};

module.exports = {
  PRESETS
};
