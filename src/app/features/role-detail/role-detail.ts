import { UpperCasePipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ROLES } from "../../data/roles";


@Component({
selector: 'app-role-detail',
imports: [RouterLink, UpperCasePipe],
templateUrl: './role-detail.html',
styleUrl: './role-detail.css',
})
export class RoleDetail {
private route = inject(ActivatedRoute);

private roleId = this.route.snapshot.paramMap.get('id');

role = computed(() => ROLES.find((role) => role.id === this.roleId));

otherRoles = computed(() => {
const availableRoles = ROLES.filter(
(role) => role.id !== this.roleId
);
// Mélange aléatoire avec Fisher-Yates

for (let i = availableRoles.length - 1; i > 0; i--) {

  const j = Math.floor(Math.random() * (i + 1));

  [availableRoles[i], availableRoles[j]] = [

    availableRoles[j],

    availableRoles[i],

  ];

}

// Retourne au maximum 4 rôles

return availableRoles.slice(0, 4);
});
}