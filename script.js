// Enhanced game logic with better point system
let activities = [];
let points = 0;
let streak = 0;
let level = 1;
const lastCompletedDate = localStorage.getItem('lastCompletedDate') || null;

document.getElementById('add-activity').addEventListener('click', function() {
    const activityInput = document.getElementById('activity-input');
    const activity = activityInput.value.trim();
    if (activity) {
        // Calculate points based on activity length (longer = harder = more points)
        const activityPoints = Math.min(50, Math.max(10, Math.floor(activity.length / 3)));
        
        activities.push({
            text: activity,
            points: activityPoints,
            completed: false
        });
        
        updateActivityList();
        activityInput.value = '';
        updateGameStats();
    }
});

function updateActivityList() {
    const activitiesList = document.getElementById('activities');
    activitiesList.innerHTML = '';
    
    activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.className = 'mb-2 cursor-pointer hover:text-blue-500';
        li.innerHTML = `
            ${activity.text} 
            <span class="text-sm text-gray-500">(${activity.points} pts)</span>
            ${activity.completed ? '<i class="fas fa-check text-green-500 ml-2"></i>' : ''}
        `;
        
        li.addEventListener('click', () => {
            if (!activity.completed) {
                // Complete activity
                activities[index].completed = true;
                points += activity.points;
                
                // Check for streak
                const today = new Date().toDateString();
                if (lastCompletedDate !== today) {
                    streak++;
                    localStorage.setItem('lastCompletedDate', today);
                }
                
                // Level up every 100 points
                if (points >= level * 100) {
                    level++;
                }
                
                updateActivityList();
                updateGameStats();
            }
        });
        
        activitiesList.appendChild(li);
    });
}

function updateGameStats() {
    document.getElementById('points').textContent = points;
    document.getElementById('streak').textContent = streak;
    document.getElementById('level').textContent = level;
    
    // Visual feedback
    if (points > 0) {
        document.getElementById('progress').classList.add('animate-pulse');
        setTimeout(() => {
            document.getElementById('progress').classList.remove('animate-pulse');
        }, 500);
    }
}

// Initialize
updateGameStats();
