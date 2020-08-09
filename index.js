const commands = require('probot-commands')
//These are excluded from the final count.
const initialCheckCount = 6;
module.exports = (app) => {
  commands(app, 'result', async (context) => {
    const issueObject = await context.github.issues.listComments({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name, 
      issue_number: context.payload.issue.number
    });
    const issueURL = context.payload.issue.html_url;

    if (context.payload.repository.name == "event-diversity-and-inclusion")
    {
      initialCheckCount = 4;
    }
    
    let checklists = issueObject.data.filter(function (comment) {
    return (comment.user.type == "Bot") && (comment.body.substring(0, 15) == "# Checklist for");
    })
//mapping not required for total check calculation
    let totalCheckCount = checklists.map(function (element) {
      return ((element.body.match(/\[x\]/g) || []).length) + ((element.body.match(/\[ \]/g) || []).length);
    })

    console.log(totalCheckCount);
    totalCheckCount = totalCheckCount.map(function (element) {
      return element - initialCheckCount;
    });

    let positiveCheckCount = checklists.map(function (element) {

        let checkCount =  +((element.body.match(/\[x\]/g) || []).length) - initialCheckCount;
        if (checkCount <= 0)
          return 0;
        else
          return checkCount;
    })

    let percentages = positiveCheckCount.map(function (element) {
      let p = Math.floor((element/totalCheckCount[0]) * 100);
      return p;
    })

    let reviewerCount = percentages.length;
    let reviewResult = 0;
    percentages.forEach(element => {
      reviewResult += element;
    });
    reviewResult /= reviewerCount;
  console.log(reviewResult);
  const badgeAssigned =  (reviewResult < 40) ? ["pending", "D%26I-Pending-red"] : ((reviewResult  < 60) ? ["passing", "D%26I-Passing-passing"] : ((reviewResult < 80) ? ["silver", "D%26I-Silver-silver"] : ((reviewResult <= 100) ? ["gold", "D%26I-Gold-yellow"] : ["pending", "D%26I-Pending-red"])));

  const url = "https://img.shields.io/badge/" + badgeAssigned[1] + "?style=flat-square&labelColor=583586&&link=" + issueURL + "/&logo=data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI1MCAyNTAiPgo8cGF0aCBmaWxsPSIjMUM5QkQ2IiBkPSJNOTcuMSw0OS4zYzE4LTYuNywzNy44LTYuOCw1NS45LTAuMmwxNy41LTMwLjJjLTI5LTEyLjMtNjEuOC0xMi4yLTkwLjgsMC4zTDk3LjEsNDkuM3oiLz4KPHBhdGggZmlsbD0iIzZBQzdCOSIgZD0iTTE5NC42LDMyLjhMMTc3LjIsNjNjMTQuOCwxMi4zLDI0LjcsMjkuNSwyNy45LDQ4LjVoMzQuOUMyMzYuMiw4MC4yLDIxOS45LDUxLjcsMTk0LjYsMzIuOHoiLz4KPHBhdGggZmlsbD0iI0JGOUNDOSIgZD0iTTIwNC45LDEzOS40Yy03LjksNDMuOS00OS45LDczLTkzLjgsNjUuMWMtMTMuOC0yLjUtMjYuOC04LjYtMzcuNS0xNy42bC0yNi44LDIyLjQKCWM0Ni42LDQzLjQsMTE5LjUsNDAuOSwxNjIuOS01LjdjMTYuNS0xNy43LDI3LTQwLjIsMzAuMS02NC4ySDIwNC45eiIvPgo8cGF0aCBmaWxsPSIjRDYxRDVGIiBkPSJNNTUuNiwxNjUuNkMzNS45LDEzMS44LDQzLjMsODguOCw3My4xLDYzLjVMNTUuNywzMy4yQzcuNSw2OS44LTQuMiwxMzcuNCwyOC44LDE4OEw1NS42LDE2NS42eiIvPgo8L3N2Zz4K";

  const badgeImage = "![Assigned badge: " + badgeAssigned[0] + "](" + url + ")";
  const message = "\n**Badge Image:**\n```\n" + badgeImage + "\n```"
                + "\nReview percentage: " + reviewResult + "\n"
                + "\nNumber of reviewers: " + reviewerCount + "\n";

  return context.github.issues.createComment(
    context.issue({ body: badgeImage + message}));

  });

}


/*Steps:
- Link the above code to commands
- create different files for Events and projects
- refer to other probots
*/

/*commands(app, 'generate', (context, command) => {
  const statusArray = command.arguments.split(/, */
  /*const status = statusArray[0];
  const pullRequestURL = context.payload.issue.html_url;
  const config = async() => await context.config('config.yml');
  //Badge is pending unless otherwise specified

  let finalBadgeURL = config.passingBadgeURL;
  /*if (status == "passing")
  {
    if(config.passingBadgeURL)
    console.log(config.passingBadgeURL);
     // finalBadgeURL = passingBadgeURL;
  }
  if (status == "silver")
  {
    if(config.silverBadgeURL)
      finalBadgeURL = silverBadgeURL;
  }
  if (status == "gold")
  {
    if(config.goldBadgeURL)
      finalBadgeURL = goldBadgeURL;
  }*/
  /*finalBadgeURL += "&link=" + pullRequestURL;
  const instructions =
  `Paste the Markdown link below where you want the badge displayed.`;
  const finalBadge = "![badge-level](" + finalBadgeURL + ")";
  
  const badgeMessage = finalBadge + "\n" + instructions + "\n```\n" + "Markdown: " + finalBadge + "\n```" ;
  return context.github.issues.createComment(
    context.issue({ body: badgeMessage })
  );
});*/
